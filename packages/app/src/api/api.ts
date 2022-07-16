/*
 * Copyright © 2022 Durudex
 *
 * This file is part of Durudex: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Durudex is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Durudex. If not, see <https://www.gnu.org/licenses/>.
 */

import {createClient, gql, OperationResult, TypedDocumentNode} from '@urql/core'
import {Form} from '@durudex-web/form'
import {createState} from '@durudex-web/flow'
import {showError} from '$/notifications/api'

export {gql}

const ApiUrl = import.meta.env.PROD
  ? 'https://api.durudex.com/query'
  : '/dev-api'

export const client = createClient({url: ApiUrl})

type QueryType = 'query' | 'mutation'

export type Query<Variables extends {}, Result> = {
  run(variables: Variables): Promise<NormalizedResult<Result>>
  runWithForm(form: Form<Variables>): Promise<NormalizedResult<Result>>
}

export const access = createState<string | null>(null)
export const refresh = createState<string | null>(null)

const AuthTokenFailedMsg = 'Authorization token failed'

export function defineQuery<Variables extends {}, Result = void>(
  type: QueryType,
  code: TypedDocumentNode<Result, Variables>,
  provideAccess = false
): Query<Variables, Result> {
  function run(variables: Variables): Promise<NormalizedResult<Result>> {
    return client[type]<Result, Variables>(code, variables, {
      fetchOptions: {
        // prettier-ignore
        headers: provideAccess
          ? {Authentication: `Bearer ${access}`}
          : {},
      },
    })
      .toPromise()
      .then(normalizeResult)
      .catch(error => {
        console.error('api error:')
        console.dir(error)

        const result: NormalizedResult<Result> = {
          data: null,
          errors: ['Something went wrong while fetching data.'],
          variableErrors: null,
        }
        return result
      })
      .then(async result => {
        const currentRefreshToken = refresh()
        if (hasAccessError(result) && currentRefreshToken) {
          // refresh access token and re-execute itself
          const {data} = await refreshTokenQuery.run({
            refresh: currentRefreshToken,
          })
          if (data) {
            access(data)
            await run(variables)
          }
        }
        await reportErrors(result)
        return result
      })
  }

  function runWithForm(form: Form<Variables>) {
    form.pending(true)
    const variables = form.assert()

    return run(variables).then(result => {
      if (result.variableErrors) {
        form.propagateErrors(result.variableErrors)
      }
      form.pending(false)
      return result
    })
  }

  return {run, runWithForm}
}

const ErrorsToVarsMappping: Record<string, string> = {
  'Invalid Username': 'username',
  'Invalid Email': 'email',
  'Invalid Password': 'password',
}

// prettier-ignore
type NormalizedResult<Data> =
  | { data: Data; errors: null; variableErrors:null}
  | {
      data: null
      errors: (Error | string)[]
      variableErrors: Record<string, string> | null
    }

function normalizeResult<Vars, Res>(
  op: OperationResult<Res, Vars>
): NormalizedResult<Res> {
  if (op.data) {
    return {data: op.data, errors: null, variableErrors: null}
  }

  if (op.error?.networkError) {
    return {data: null, errors: [op.error.networkError], variableErrors: null}
  }

  if (op.error?.graphQLErrors) {
    const variableErrors: Record<string, string> = {}
    let variableErrorsChanged = false
    const errors: string[] = []

    for (const err of op.error.graphQLErrors) {
      const vary = ErrorsToVarsMappping[err.message]
      if (vary) {
        variableErrors[vary] = err.message
        variableErrorsChanged = true
      } else errors.push(err.message)
    }

    return {
      data: null,
      errors,
      variableErrors: variableErrorsChanged ? variableErrors : null,
    }
  }

  return {} as never
}

async function reportErrors<Data>(
  result: NormalizedResult<Data>,
  form?: Form<Data>
) {
  if (result.errors) {
    for (const error of result.errors) {
      console.error('error:', error)
      await showError(error instanceof Error ? error.message : error)
    }
  }

  if (result.variableErrors) {
    console.error('variable errors:')
    console.dir(result.variableErrors)
  }

  if (form) {
    if (result.variableErrors) {
      form.propagateErrors(result.variableErrors)
    }
  }
}

function hasAccessError<Data>(result: NormalizedResult<Data>) {
  if (result.errors) {
    const [err] = result.errors
    if (
      typeof err === 'object' &&
      'message' in err &&
      err.message === AuthTokenFailedMsg
    ) {
      return true
    }
  }
  return false
}

const refreshTokenQuery = defineQuery<{refresh: string}, string>(
  'mutation',
  gql`
    mutation RefreshToken($token: String!) {
      refreshToken(input: {token: $token})
    }
  `
)

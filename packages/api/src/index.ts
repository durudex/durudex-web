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

import {createClient, gql, TypedDocumentNode} from '@urql/core'
import {Form} from '@durudex-web/form'

import {ApiResult, resultOfUrql, resultErr} from './api-result'
import {config, ShowError} from './config'

export {config}
export {gql}

const ApiUrl = (import.meta as any).env.PROD
  ? 'https://api.dev.durudex.com/query'
  : '/dev-api'

export const client = createClient({url: ApiUrl})

type QueryType = 'query' | 'mutation'

export function defineQuery<Variables extends {}, Data = void>(
  type: QueryType,
  code: TypedDocumentNode<Data, Variables>,
  provideAccess = false
) {
  return new Query<Variables, Data>(type, code, provideAccess)
}

class Query<Variables extends {}, Data> {
  constructor(
    private type: QueryType,
    private code: TypedDocumentNode<Data, Variables>,
    private withAuth: boolean
  ) {}

  run(
    variables: Variables,
    showError = config.showError
  ): Promise<ApiResult<Data>> {
    const headers: HeadersInit = this.withAuth
      ? {Authentication: `Bearer ${config.access}`}
      : {}

    return client[this.type]<Data, Variables>(
      //
      this.code,
      variables,
      {fetchOptions: {headers}}
    )
      .toPromise()
      .then(resultOfUrql)
      .catch(error => {
        console.error('api error:')
        console.dir(error)
        return resultErr<any>(['Something went wrong while fetching data.'])
      })

      .then(async res => {
        if (hasAccessError(res) && config.refresh) {
          console.error('access error... re-running query')
          await this.refreshAndRerun(variables)
        }

        if (res.errors) {
          for (const error of res.errors) {
            console.error('error:', error)
            await showError(typeof error === 'string' ? error : error.message)
          }
        }

        if (res.variableErrors) {
          console.error('variable errors:')
          console.dir(res.variableErrors)
        }
        return res
      })
  }

  private async refreshAndRerun(variables: Variables) {
    const {data} = await refreshTokenQuery.run({refresh: config.refresh!})
    if (data) {
      config.access = data
      return this.run(variables)
    }
  }

  runWithForm(form: Form<Variables>, showError?: ShowError) {
    form.pending(true)
    const variables = form.assert()

    return this.run(variables, showError).then(res => {
      if (res.variableErrors) {
        form.propagateErrors(res.variableErrors)
      }
      form.pending(false)
      return res
    })
  }
}

const AuthTokenFailedMsg = 'Authorization token failed'

function hasAccessError<Data>(result: ApiResult<Data>) {
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

export interface Tokens {
  access: string
  refresh: string
}

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

import {Form} from '@durudex-web/form'
import {OperationResult as UrqlResult} from '@urql/core'

import {config} from './config'

const ErrorsToVarsMappping: Record<string, string> = {
  'Invalid Username': 'username',
  'Invalid Email': 'email',
  'Invalid Password': 'password',
}

type ApiResultErrors = (Error | string)[]
type ApiResultVariableErrors = Record<string, string> | null

// prettier-ignore
export type ApiResult<Data> =
  | { data: Data; errors: null; variableErrors:null}
  | {
      data: null
      errors: ApiResultErrors
      variableErrors: ApiResultVariableErrors
    }

export function resultOfUrql<Vars, Res>(
  raw: UrqlResult<Res, Vars>
): ApiResult<Res> {
  if (raw.data) {
    return resultOk(raw.data)
  }

  if (raw.error?.networkError) {
    return resultErr([raw.error.networkError])
  }

  if (raw.error?.graphQLErrors) {
    const variableErrors: Record<string, string> = {}
    let variableErrorsChanged = false
    const errors: string[] = []

    for (const err of raw.error.graphQLErrors) {
      const vary = ErrorsToVarsMappping[err.message]
      if (vary) {
        variableErrors[vary] = err.message
        variableErrorsChanged = true
      } else errors.push(err.message)
    }

    return resultErr(errors, variableErrorsChanged ? variableErrors : null)
  }

  return {} as never
}

export function resultOk<Data>(data: Data): ApiResult<Data> {
  return {data, errors: null, variableErrors: null}
}

export function resultErr<Data>(
  errors: ApiResultErrors,
  variableErrors: ApiResultVariableErrors = null
): ApiResult<Data> {
  return {data: null, errors, variableErrors}
}

export async function reportErrors<Data>(
  res: ApiResult<Data>,
  form?: Form<Data>
) {
  if (res.errors) {
    for (const error of res.errors) {
      console.error('error:', error)
      await config.showError(typeof error === 'string' ? error : error.message)
    }
  }

  if (res.variableErrors) {
    console.error('variable errors:')
    console.dir(res.variableErrors)
  }

  if (form) {
    if (res.variableErrors) {
      form.propagateErrors(res.variableErrors)
      console.error('PROPAGATE:', res.variableErrors)
    }
  }
}

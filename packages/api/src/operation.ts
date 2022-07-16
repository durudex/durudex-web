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
import {OperationResult as RawResult} from '@urql/core'

import {showError} from './config'

const ErrorsToVarsMappping: Record<string, string> = {
  'Invalid Username': 'username',
  'Invalid Email': 'email',
  'Invalid Password': 'password',
}

type OperationErrors = (Error | string)[]
type OperationVariableErrors = Record<string, string> | null

// prettier-ignore
export type Operation<Data> =
  | { data: Data; errors: null; variableErrors:null}
  | {
      data: null
      errors: OperationErrors
      variableErrors: OperationVariableErrors
    }

export function operationFromResult<Vars, Res>(
  raw: RawResult<Res, Vars>
): Operation<Res> {
  if (raw.data) {
    return okOperation(raw.data)
  }

  if (raw.error?.networkError) {
    return errorOperation([raw.error.networkError])
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

    return errorOperation(errors, variableErrorsChanged ? variableErrors : null)
  }

  return {} as never
}

export function okOperation<Data>(data: Data): Operation<Data> {
  return {data, errors: null, variableErrors: null}
}

export function errorOperation<Data>(
  errors: OperationErrors,
  variableErrors: OperationVariableErrors = null
): Operation<Data> {
  return {data: null, errors, variableErrors}
}

export async function reportErrors<Data>(
  op: Operation<Data>,
  form?: Form<Data>
) {
  if (op.errors) {
    for (const error of op.errors) {
      console.error('error:', error)
      await showError()(typeof error === 'string' ? error : error.message)
    }
  }

  if (op.variableErrors) {
    console.error('variable errors:')
    console.dir(op.variableErrors)
  }

  if (form) {
    if (op.variableErrors) {
      form.propagateErrors(op.variableErrors)
    }
  }
}

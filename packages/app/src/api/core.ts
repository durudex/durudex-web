import {createClient, OperationResult, TypedDocumentNode} from '@urql/core'
import {Form} from '@durudex-web/form'
// import {showErrorNotification} from '$/notifications/api'

export {gql} from '@urql/core'

const ApiUrl = import.meta.env.PROD
  ? 'https://api.durudex.com/query'
  : '/dev-api'

export const client = createClient({url: ApiUrl})

type QueryType = 'query' | 'mutation'

export function defineQuery<Variables extends {}, Result>(
  type: QueryType,
  code: TypedDocumentNode<Result, Variables>
) {
  return (input: Variables | Form<Variables>) => {
    const isForm = input instanceof Form
    const variables = isForm ? input.assert() : input

    if (isForm) {
      input.pending(true)
    }

    client[type]<Result, Variables>(code, variables)
      .toPromise()
      .then(normalizeResult)
      .then(async result => {
        if (result.errors) {
          for (const error of result.errors) {
            console.error('error:', error)
            // await showErrorNotification(e)
          }
        }

        if (result.variableErrors) {
          console.error('variable errors:')
          console.dir(result.variableErrors)
        }

        if (isForm) {
          if (result.variableErrors) {
            input.propagateErrors(result.variableErrors)
          }

          input.pending(false)
        }

        return result
      })
  }
}

const CommonErrorsToVariables: Record<string, string> = {
  'Invalid Username': 'username',
  'Invalid Email': 'email',
  'Invalid Password': 'password',
}

function normalizeResult<Vars, Res>(op: OperationResult<Res, Vars>) {
  if (op.data) {
    return {data: op.data, errors: null, variableErrors: null}
  }

  if (op.error?.networkError) {
    return {errors: [op.error.networkError], variableErrors: null}
  }

  if (op.error?.graphQLErrors) {
    const variableErrors: Record<string, string> = {}
    const errors: string[] = []

    for (const err of op.error.graphQLErrors) {
      const vary = CommonErrorsToVariables[err.message]
      if (vary) variableErrors[vary] = err.message
      else errors.push(err.message)
    }

    return {errors, variableErrors}
  }

  return {} as never
}

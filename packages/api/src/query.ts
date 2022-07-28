import {gql, TypedDocumentNode} from '@urql/core'
import {client, config, ShowError} from './client'
import {ApiResult, resultOfUrql, resultErr} from './api-result'
import {Form} from '@durudex-web/form'

export {gql}

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

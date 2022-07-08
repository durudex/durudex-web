import {defineQuery, gql} from '$/api/core'

export const refreshAccess = defineQuery<{refresh: string}, string>(
  'mutation',
  gql`
    mutation RefreshAccess($token: String!) {
      refreshToken(input: {token: $token})
    }
  `
)

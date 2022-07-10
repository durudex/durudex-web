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

import {defineQuery, gql} from '$/api/core'

export const signUp = defineQuery(
  'mutation',
  gql`
    mutation SignUp(
      $username: String!
      $email: String!
      $password: String!
      $code: Uint64!
    ) {
      signUp(
        input: {
          username: $username
          email: $email
          password: $password
          code: $code
        }
      )
    }
  `
)

export const signIn = defineQuery(
  'mutation',
  gql`
    mutation SignIn($username: String!, $password: String!) {
      signIn(input: {username: $username, password: $password})
    }
  `
)

export const resetPassword = defineQuery(
  'mutation',
  gql`
    mutation ResetPassword(
      $email: String!
      $password: String!
      $code: Uint64!
    ) {
      forgotPassword(input: {email: $email, password: $password, code: $code})
    }
  `
)

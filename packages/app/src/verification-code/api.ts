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

import {defineQuery, gql} from '@durudex-web/api'

const createVerificationCodeQuery = defineQuery<{email: string}>(
  'mutation',
  gql`
    mutation CreateVerificationCode($email: String!) {
      createVerifyEmailCode(email: $email)
    }
  `
)

export function requestVerificationCode(email: string) {
  return createVerificationCodeQuery
    .run({email})
    .then(x => x.data === undefined)
}

export const CodeLifetimeSeconds = 15 * 60

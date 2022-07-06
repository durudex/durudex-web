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

import {Link} from 'solid-app-router'

export function AuthHome() {
  return (
    <div class="home flex-center forward-height">
      <div class="typography">
        <p>Sign in to an account or create one</p>
        <ul>
          <li>
            <Link href="/auth/sign-in">Sign In</Link>
          </li>
          <li>
            <Link href="/auth/sign-up">Sign Up</Link>
          </li>
        </ul>
        <h3>Auth</h3>
      </div>
    </div>
  )
}

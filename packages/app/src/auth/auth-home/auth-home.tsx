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

import '$/auth/auth-home/auth-home.sass'

import logo from '$/assets/logo.png'
import bg from '$/assets/background/0.jpg'

import {Link} from 'solid-app-router'

import {AuthPage} from '$/auth/shared'
import {useBodyStyle} from 'solid-verba'

export function AuthHome() {
  useBodyStyle('--authHomeBackground', `url(${bg})`)

  return (
    <AuthPage class="authHome">
      <div class="authHome__body">
        <img class="authHome__logo" src={logo} alt="Durudex Logo" />
        <div class="authHome__actions">
          <Link class="authHome__action" href="/auth/sign-in">
            Sign In
          </Link>
          <Link class="authHome__action" href="/auth/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </AuthPage>
  )
}

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

import {AuthScreen} from '$/auth/shared'
import paneBg from '$/assets/background/3.jpg'
import {createForm, validator} from '@durudex-web/form'
import {createSignal} from '@durudex-web/flow'
import {SignUpInput} from '$/auth/sign-up/api'
import {InputString} from '$/input/input'
import {Link} from 'solid-app-router'

export function SignUp() {
  const [form, {username, email, password, code}] = createForm<SignUpInput>(
    f => ({
      username: f(''),
      email: f(''),
      password: f(''),
      code: f(0),
    })
  )

  const repeatPassword = createSignal<string>('')

  validator.run(username.error, validator.username(username.value))
  validator.run(email.error, validator.email(email.value))
  validator.run(
    password.error,
    validator.password(password.value, repeatPassword)
  )

  return (
    <AuthScreen paneSrc={paneBg} paneLeftwards={false} title="Sign Up">
      <div class="authScreen__form">
        <InputString
          label="Username"
          value={username.value}
          error={username.error()}
        />
        <InputString label="Email" value={email.value} error={email.error()} />
        <InputString
          label="Password"
          value={password.value}
          error={password.error()}
        />
        <InputString
          label="Repeat password"
          value={repeatPassword}
          error={password.error()}
        />
      </div>
      <div class="authScreen__actions">
        <Link href="/auth/sign-in" class="authScreen__actionAlt">
          Already have an account?
        </Link>
      </div>
    </AuthScreen>
  )
}

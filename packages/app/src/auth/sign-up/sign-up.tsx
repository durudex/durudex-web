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
import {createSignal} from '@durudex-web/lib'
import {createForm, V, validate} from '@durudex-web/form'
import paneBg from '$/assets/background/3.jpg'
import {AuthScreen} from '$/auth/shared'
import {signUpQuery, SignUpInput} from '$/auth/sign-up/api'
import {Submit} from '$/auth/submit/submit'
import {InputString} from '$/input/input'
import {showMessage} from '$/notifications/api'
// import {enterVerificationCode} from '$/verification-code/verification-code'

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

  validate(username.error, V.username(username.value))
  validate(email.error, V.email(email.value))
  validate(password.error, V.password(password.value, repeatPassword))

  async function submitBase(data: SignUpInput) {
    const result = await signUpQuery.runWithForm(form)
    const varys = result.variableErrors
      ? Object.entries(result.variableErrors)
      : []
    if (varys.length === 1 && varys[0][0] === 'code') {
      // only code has error'd
      // get it and retry

      code.error('')
      // await enterVerificationCode(code.value)
    }
  }

  return (
    <AuthScreen paneSrc={paneBg} paneLeftwards={false} title="Sign Up">
      <div class="authScreen__form">
        <InputString
          label="Username"
          value={username.value}
          error={username.error()}
        />
        <InputString
          type="email"
          label="Email"
          value={email.value}
          error={email.error()}
        />
        <InputString
          type="password"
          label="Password"
          value={password.value}
          error={password.error()}
        />
        <InputString
          type="password"
          label="Repeat password"
          value={repeatPassword}
          error={password.error()}
        />
      </div>
      <div class="authScreen__actions">
        <Submit form={form} onSubmit={submitBase} pending="Signing Up">
          Sign Up
        </Submit>
        <Link href="/auth/sign-in" class="authScreen__actionAlt">
          Already have an account?
        </Link>
      </div>
    </AuthScreen>
  )
}

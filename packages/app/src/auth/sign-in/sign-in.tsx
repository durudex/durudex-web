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

import paneBg from '$/assets/background/1.jpg'
import {Submit} from '$/auth/submit/submit'
import {AuthScreen} from '$/auth/shared'
import {createForm, V, validate} from '@durudex-web/form'
import {signInQuery} from '$/auth/sign-in/api'
import {useAuthorize} from '$/auth/api'
import {InputString} from '$/input/input'

export function SignIn() {
  const [form, {username, password}] = createForm(f => ({
    username: f(''),
    password: f(''),
  }))

  validate(username.error, V.username(username.value))
  validate(password.error, V.passwordBase(password.value))

  const authorize = useAuthorize()

  async function submit() {
    const {data} = await signInQuery.runWithForm(form)
    if (data) authorize(data)
  }

  return (
    <AuthScreen
      paneSrc={paneBg}
      paneLeftwards={true}
      title="Sign In"
      class="signIn"
    >
      <div class="authScreen__form signIn__body">
        <InputString
          label="Username"
          value={username.value}
          error={username.error()}
        />
        <InputString
          label="Password"
          value={password.value}
          error={password.error()}
        />
      </div>
      <div class="authScreen__actions">
        <Submit form={form} onSubmit={submit}>
          Sign In
        </Submit>
        <a href="/auth/sign-up" class="authScreen__actionAlt">
          Create an account
        </a>
      </div>
    </AuthScreen>
  )
}

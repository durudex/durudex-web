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

import {Setter, Channel, createEffect} from '@durudex-web/flow'

type ValidatorSink = Setter<string>
type ValidatorFn<Params = void> = (sink: ValidatorSink, params: Params) => void

export class Validator<Params = void> {
  static of<Params>(fn: ValidatorFn<Params>) {
    return new Validator<Params>((sink, params) => {
      let flushed = false

      fn(next => {
        if (next !== '') flushed = true
        sink(next)
      }, params)

      if (!flushed) sink('')
    })
  }

  static join(validators: ValidatorFn[]) {
    return new Validator(sink => {
      for (const validator of validators) {
        let flushed = false
        validator(next => {
          if (next !== '') flushed = true
          sink(next)
        })

        if (flushed) {
          return
        }
      }
    })
  }

  private constructor(readonly fn: ValidatorFn<Params>) {}

  run(sink: ValidatorSink, params: Params) {
    let stop = false
    createEffect(() => {
      if (stop) return
      this.fn(sink, params)
    })
    return () => (stop = true)
  }

  bind(params: Params): ValidatorFn {
    return sink => this.fn(sink, params)
  }
}

const EMAIL_REGEXP =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEXP = /^[a-zA-Z0-9@$!%*?&]{8,100}$/

export namespace Validators {
  export const nonEmpty = Validator.of<{
    subject: string
    value: Channel<string>
  }>((sink, {subject, value}) => {
    if (value() === '') {
      sink(`${subject} is required`)
    }
  })

  export const createRegexp = (regexp: RegExp, message: string) =>
    Validator.of<Channel<string>>((sink, value) => {
      if (regexp.test(value()) === false) {
        sink(message)
      }
    })

  export const email = createRegexp(EMAIL_REGEXP, 'Not a valid email')
  const passwordBase = createRegexp(PASSWORD_REGEXP, 'Not a valid password')

  export const createPassword = (
    password: Channel<string>,
    repeat: Channel<string>
  ) =>
    Validator.join([
      nonEmpty.bind({subject: 'Password', value: password}),
      passwordBase.bind(password),
      sink => {
        if (password() !== repeat()) {
          sink('Passwords must match')
        }
      },
    ])
}

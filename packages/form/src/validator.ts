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

import {Setter, Getter, effect} from 'solid-verba'

type Sink = Setter<string>
type Validator = (sink: Sink) => void
type Validators = Validator | Validator[] | Validator[][]

export function validate(sink: Sink, validators: Validators) {
  const fns = Array.isArray(validators) ? validators : [validators]

  effect(() => {
    for (const validate of fns.flat()) {
      let flushed = false
      validate(next => {
        if (next !== '') flushed = true
        return sink(next)
      })
      if (flushed) return
    }

    sink('')
  })
}

export namespace V {
  const USERNAME_REGEXP = /^[a-zA-Z0-9-_.]{3,40}$/
  const EMAIL_REGEXP =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const PASSWORD_REGEXP = /^[a-zA-Z0-9@$!%*?&]{8,100}$/

  export function ofRegexp(regexp: RegExp, message: string) {
    return (value: Getter<string>): Validator =>
      sink => {
        if (regexp.test(value()) === false) {
          sink(message)
        }
      }
  }

  export function nonEmpty(message: string) {
    return (value: Getter<string>): Validator =>
      sink => {
        if (value() === '') sink(message)
      }
  }

  export const username = ofRegexp(USERNAME_REGEXP, 'Not a valid username')
  export const email = ofRegexp(EMAIL_REGEXP, 'Not a valid email')
  export const passwordBase = ofRegexp(PASSWORD_REGEXP, 'Not a valid password')

  export const password = (
    value: Getter<string>,
    repeat: Getter<string>
  ): Validators => [
    passwordBase(value),
    sink => {
      if (value() !== repeat()) sink('Passwords must match')
    },
  ]
}

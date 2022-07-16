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

import {Setter, Getter, createEffect} from '@durudex-web/flow'

type Sink = Setter<string>
type Validator = (sink: Sink) => void
type Validators = (Validator | Validator[])[]

const USERNAME_REGEXP = /^[a-zA-Z0-9-_.]{3,40}$/
const EMAIL_REGEXP =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEXP = /^[a-zA-Z0-9@$!%*?&]{8,100}$/

function ofRegexp(regexp: RegExp, message: string) {
  return (value: Getter<string>): Validator =>
    sink => {
      if (regexp.test(value()) === false) {
        sink(message)
      }
    }
}

function nonEmpty(message: string) {
  return (value: Getter<string>): Validator =>
    sink => {
      if (value() === '') sink(message)
    }
}

export const username = (value: Getter<string>) => [
  nonEmpty('Username is required')(value),
  ofRegexp(USERNAME_REGEXP, 'Not a valid username')(value),
]

export const email = (value: Getter<string>) => [
  nonEmpty('Email is required'),
  ofRegexp(EMAIL_REGEXP, 'Not a valid email'),
]

export const passwordBase = (value: Getter<string>) => [
  nonEmpty('Password is required')(value),
  ofRegexp(PASSWORD_REGEXP, 'Not a valid password')(value),
]

export const password = (
  value: Getter<string>,
  repeat: Getter<string>
): Validators => [
  passwordBase(value),
  sink => {
    if (value() !== repeat()) sink('Passwords must match')
  },
]

export function run(sink: Sink, validators: Validators) {
  createEffect(() => {
    for (const validate of validators.flat()) {
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

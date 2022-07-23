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

import {createSignal as solidCreateSignal} from 'solid-js'
import {SignalOptions} from 'solid-js/types/reactive/signal'
import {createLazyMemo} from '@solid-primitives/memo'
import {Defined, Getter, Setter, Channel} from './types'

export function createChannel<Value extends Defined>(
  get: Getter<Value>,
  set: Setter<Value>
): Channel<Value> {
  return next => (next === undefined ? get() : set(next))
}

export function createSignal<Value extends Defined>(
  value: Value,
  opts?: SignalOptions<Value>
) {
  const [get, set] = solidCreateSignal(value, opts)
  // @ts-ignore
  return createChannel<Value>(get, set)
}
export function createBool(initial = false) {
  const value = createSignal(initial)
  const toggle = () => value(!value())
  return [value, toggle] as const
}

// re-exports

export {
  createEffect,
  createMemo,
  on,
  untrack,
  //
  For,
  Show,
  Match,
  Switch,
  //
  onMount,
  onCleanup,
} from 'solid-js'
export {createLazyMemo} from '@solid-primitives/memo'
export {createMutable} from 'solid-js/store'

// // decorators

export function memo<Host extends object, Value>(
  _target: Host,
  _key: string,
  descriptor: TypedPropertyDescriptor<() => Value>
) {
  const memos = new WeakMap<Host, Getter<Value>>()

  const backup = descriptor.value!
  descriptor.value = function (this: Host) {
    let memoFn = memos.get(this)
    if (!memoFn) {
      memoFn = createLazyMemo(backup.bind(this))
      memos.set(this, memoFn)
    }

    return memoFn()
  }
}

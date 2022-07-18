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

export type Channel<Value> = (next?: Value) => Value
export type Getter<Value> = () => Value
export type Setter<Value> = (next: Value) => Value

export function createChannel<Value>(
  get: () => Value,
  set: (next: Value) => Value
): Channel<Value> {
  return (next?: Value) => (next === undefined ? get() : set(next))
}

export function createSignal<Value extends {} | null>(
  value: Value,
  opts: SignalOptions<Value> = {}
) {
  const [get, set] = solidCreateSignal(value, opts)

  return createChannel<Value>(
    () => get(),
    next => (set(next as any), next)
  )
}

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

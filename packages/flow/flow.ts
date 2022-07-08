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

export type Channel<T> = (next?: T) => T
export type Getter<T> = () => T
export type Setter<T> = (next: T) => void

export function createChannel<T>(
  get: () => T,
  set: (next: T) => T
): Channel<T> {
  return (next?: T) => (next === undefined ? get() : set(next))
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
  //
  For,
  Show,
  Match,
  Switch,
} from 'solid-js'
export {createMutable} from 'solid-js/store'

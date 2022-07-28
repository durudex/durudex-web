import {createSignal} from 'solid-js'
import {Getter, Setter, Channel, Defined, Comparator} from './types'

export function channel<T extends Defined>(
  get: Getter<T>,
  set: Setter<T>
): Channel<T> {
  return next => (next === undefined ? get() : set(next))
}

interface SignalOptions<T> {
  equals?: Comparator<T>
}

export function signal<T extends Defined>(
  initial: T,
  options: SignalOptions<T> = {}
) {
  const [get, set] = createSignal(initial, options) as any
  return channel(get, set) as Channel<T>
}

export {createEffect as effect, createMemo as instantMemo} from 'solid-js'
export {createMutable as store} from 'solid-js/store'
export {createLazyMemo as memo} from '@solid-primitives/memo'
export {render, Show, For} from 'solid-js/web'

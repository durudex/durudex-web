import {
  createSignal,
  createEffect as effect,
  createMemo as instantMemo,
} from 'solid-js'
import {createLazyMemo as memo} from '@solid-primitives/memo'
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
  return channel(get, set)
}

// function identity<T>(value: T) {
//   return value
// }

// export function customSignal<T extends Defined>(
//   initial: T,
//   onGet: Mapper<T> = identity,
//   onSet: Mapper<T> = identity,
//   options: SignalOptions<T>
// ) {
//   const state = signal(initial, options)

//   return channel(get, set)
// }

export {effect, memo, instantMemo}

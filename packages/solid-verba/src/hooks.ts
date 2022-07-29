import {onMount, onCleanup, getOwner, runWithOwner} from 'solid-js'
import {delay, interval} from './timers'
import {Getter} from './types'

export function useBodyClass(...tokens: string[]) {
  onMount(() => document.body.classList.add(...tokens))
  onCleanup(() => document.body.classList.remove(...tokens))
}

export function useBodyStyle(property: string, value: string) {
  onMount(() => document.body.style.setProperty(property, value))
  onCleanup(() => document.body.style.removeProperty(property))
}

export function useDelay(ms: number) {
  return delay(ms, onCleanup)
}

export function useInterval(ms: number, fn: () => boolean) {
  return interval(ms, fn, onCleanup)
}

export function useOwner() {
  const owner = getOwner()
  if (!owner) throw new Error('No owner')
  return <T>(fn: Getter<T>) => runWithOwner(owner, fn)
}

export {onMount, onCleanup}

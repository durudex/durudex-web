import {Setter, Action} from './types'

export function delay(ms: number, setAbort?: Setter<Action>) {
  return new Promise<void>(resolve => {
    const timer = setTimeout(resolve, ms)
    setAbort?.(() => {
      clearTimeout(timer)
      resolve()
    })
  })
}

export function interval(
  ms: number,
  fn: () => boolean,
  setAbort?: Setter<Action>
) {
  let timer: number

  function schedule() {
    timer = setTimeout(() => {
      const result = fn()
      if (result === true) schedule()
    }, ms)
  }
  schedule()

  setAbort?.(() => clearTimeout(timer))
}

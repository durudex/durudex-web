import {createRoot, Action} from 'solid-verba'

export function inRoot(fn: Action) {
  createRoot(dispose => {
    fn()
    afterAll(dispose)
  })
}

import {Getter, Awaitable, delay, createSignal} from '@durudex-web/lib'
import {Customizable, classes} from '$/props/props'

type SubmitBaseProps = Customizable & {
  blocked?: boolean
  pending?: Getter<boolean>
  onSubmit: () => Awaitable
}

export function Submit(props: SubmitBaseProps) {
  async function onClick() {
    if (props.blocked) return
    await props.onSubmit()
    if (import.meta.env.DEV) await delay(500)
  }

  return (
    <button
      class={classes(props, 'full-width button button_bigger')}
      classList={{button_disabled: props.blocked || props.pending?.()}}
      onClick={onClick}
    >
      {props.pending?.() ? 'Please wait...' : props.children}
    </button>
  )
}

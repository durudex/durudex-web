import {
  Container,
  classes,
  Getter,
  Awaitable,
  useDelay,
  useOwner,
} from 'solid-verba'

type SubmitBaseProps = Container & {
  blocked?: boolean
  pending?: Getter<boolean>
  onSubmit: () => Awaitable
}

export function Submit(props: SubmitBaseProps) {
  const run = useOwner()

  async function onClick() {
    if (props.blocked) return
    await props.onSubmit()
    if (import.meta.env.DEV) await run(() => useDelay(500))
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

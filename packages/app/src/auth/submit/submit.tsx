// import '$/auth/submit.sass'

import {Awaitable} from '@durudex-web/lib'
import {Element, Customizable, classes} from '$/props/props'

type SubmitBaseProps = Customizable & {
  blocked?: boolean
  pending?: Element
  onSubmit: () => void
}

export function Submit(props: SubmitBaseProps) {
  async function onClick() {
    if (props.blocked) return
    props.onSubmit()
  }

  return (
    <button
      class={classes(props, 'full-width button button_bigger')}
      classList={{button_disabled: props.blocked || !!props.pending}}
      onClick={onClick}
    >
      {props.pending ? props.pending : props.children}
    </button>
  )
}

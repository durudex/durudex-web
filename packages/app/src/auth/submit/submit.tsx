// import '$/auth/submit.sass'

import {Form} from '@durudex-web/form'
import {WithChildren, WithClass, classes} from '$/props/props'

// prettier-ignore
export type SubmitProps<S> =
  WithChildren &
  WithClass &
  {
    form: Form<S>
    onSubmit: (value: S) => void | PromiseLike<void>
    pending?: string
  }

export function Submit<FormSchema>(props: SubmitProps<FormSchema>) {
  async function handleClick() {
    if (props.form.block()) return
    props.form.pending(true)

    if (import.meta.env.DEV) {
      await new Promise(res => setTimeout(res, 1000))
    }
    await props.onSubmit(props.form.assert())

    props.form.pending(false)
  }

  return (
    <button
      class={classes(props, 'full-width button button_bigger')}
      classList={{button_disabled: props.form.block()}}
      onClick={handleClick}
    >
      {props.form.pending() && props.pending ? props.pending : props.children}
    </button>
  )
}

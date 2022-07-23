import '$/input/input.sass'

import {Channel} from '@durudex-web/lib'
import {WithChildren, WithClass, classes} from '$/props/props'

type InputBaseProps = WithClass & {label: string; error: string}
type InputWrapperProps = InputBaseProps & WithChildren

export function InputBase(props: InputWrapperProps) {
  return (
    <div class={classes(props, 'input')}>
      <div class="input__label">
        <span>{props.label}</span>
        <span class="input__error">{props.error}</span>
      </div>
      {props.children}
    </div>
  )
}

type InputType = 'string' | 'email' | 'password'

export type InputStringProps = InputBaseProps & {
  value: Channel<string>
  type?: InputType
}

type InputEvent = {currentTarget: HTMLInputElement}

export function InputString(props: InputStringProps) {
  function handleInput(e: InputEvent) {
    const next = e.currentTarget.value
    props.value(next)
  }

  return (
    <InputBase
      {...props}
      error={props.value() ? props.error : ''}
      class={classes(props, 'inputString')}
    >
      <input
        value={props.value()}
        class="inputString__input input__body"
        type={props.type}
        onInput={handleInput}
      />
    </InputBase>
  )
}

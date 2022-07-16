import '$/input/input.sass'

import {Channel} from '@durudex-web/flow'
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

export type InputStringProps = InputBaseProps & {value: Channel<string>}

type InputEvent = {currentTarget: HTMLInputElement}

export function InputString(props: InputStringProps) {
  function handleInput(e: InputEvent) {
    const next = e.currentTarget.value
    props.value(next)
    e.currentTarget.value = props.value()
  }

  return (
    <InputBase {...props} class={classes(props, 'inputString')}>
      <input
        class="inputString__input input__body"
        type="string"
        onInput={handleInput}
      />
    </InputBase>
  )
}

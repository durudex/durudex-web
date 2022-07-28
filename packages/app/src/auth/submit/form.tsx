import {Form} from '@durudex-web/form'
import {Awaitable, Container} from 'solid-verba'
import {Submit} from '$/auth/submit/submit'

type SubmitFormProps<Schema> = Container & {
  form: Form<Schema>
  onSubmit: (data: Schema) => Awaitable
}

export function SubmitForm<Schema extends {}>(props: SubmitFormProps<Schema>) {
  function onSubmit() {
    props.onSubmit(props.form.assert())
  }

  return (
    <Submit
      onSubmit={onSubmit}
      blocked={props.form.block()}
      pending={props.form.pending}
      class={props.class}
      children={props.children}
    />
  )
}

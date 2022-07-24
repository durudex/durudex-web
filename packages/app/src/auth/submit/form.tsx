import {Form} from '@durudex-web/form'
import {Customizable} from '$/props/props'
import {Awaitable} from '@durudex-web/lib'
import {Submit} from '$/auth/submit/submit'

type SubmitFormProps<Schema> = Customizable & {
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

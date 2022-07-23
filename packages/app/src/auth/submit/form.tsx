import {Form} from '@durudex-web/form'
import {Customizable, Element} from '$/props/props'
import {Awaitable} from '@durudex-web/lib'
import {Submit} from '$/auth/submit/submit'

type SubmitFormProps<Schema> = Customizable & {
  form: Form<Schema>
  onSubmit: (data: Schema) => Awaitable
}

export function SubmitForm<Schema extends {}>(props: SubmitFormProps<Schema>) {
  async function onSubmit() {
    props.form.pending(true)
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 500))
    }
    await props.onSubmit(props.form.assert())
    props.form.pending(false)
  }

  return (
    <Submit
      onSubmit={onSubmit}
      pending={props.form.pending() ? 'Please wait' : undefined}
    >
      {props.children}
    </Submit>
  )
}

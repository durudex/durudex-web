# `@durudex-web/form`

Minimal form management library.

## `Form`

```js
const form = new Form<Shema>()
```

### `add(key: keyof Schema, field: Field<Schema[Key]>): this`

Bind a Field object to the specified form field.

### `struct(): Schema | null`

Returns a dictionary of field keys and field values or null if any field has non-empty `error`.

### `assert(): Schema`

Same as struct() but throws an error if form is blocked

### `pending: Channel<boolean>`

Get/set form pending state.

### `block(): boolean`

True if this form is invalid or is "pending".

## `Field`

```ts
const field = new Field<Value>(initial)
form.add('field', field)
```

### `value: Channel<Value>`

### `error: Channel<string>`

### `reset(): void`

## `createForm`

Easier way to create and initialize a form and its fields.

```js
const [form, {field1, field2}] = createForm(define => ({
  field1: define(0),
  field2: define(true),
}))

form // Form<{field1: number, field2: boolean}>
```

## Validators

In our terminology, validator is a function that accepts a writable channel named `sink`. Some factory supplies it with all input data, like the reactive channel is processing, etc. If validator succeeds, it does nothing or writes empty string to a sink. If validator fails, it writes the reason to a sink.

## `validate`

Accepts a sink and an array of validators.
Creates an effect that runs every validator in a loop until the first failure.
If each validator succeeds, writes empty string to a `sink`.

## `V` namespace

There are some validation functions provided out of the box.

- `ofRegexp`, `nonEmpty`: validator factories factories 😩
- `username`, `email`, `passwordBase`: factories of RegExp validators
- `password`: compound password validator, used in situations where user should enter password twice (see example)

## Example of all of this

```tsx
const [form, {username, email, password}] = createForm<SignUpInput>(f => ({
  username: f(''),
  email: f(''),
  password: f(''),
  code: f(0),
}))

// repeat password input may use password's `error`
const repeatPassword = createSignal<string>('')

validate(username.error, V.username(username.value))
validate(email.error, V.email(email.value))
validate(password.error, V.password(password.value, repeatPassword))

createEffect(() => {
  console.warn('email.error:', email.error())
})
```

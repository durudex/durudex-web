# `@durudex-web/lib`

## Types

- data access: `Getter`, `Setter`, `Channel` (getter & setter function)
- common: `Defined` (anything but undefined)

## `createChannel`

Channel is a data access abstraction with a simple interface:

```js
function increment(chan: Channel<number>) {
  chan(chan() + 1)
}

let _value = 0
const value = createChannel(
  () => _value,
  next => (_value = next)
)

value() // 0
increment(value) // 1
value() // 1
value(3) // 3
```

Channel represents a function used both for reading and writing data from and to arbitrary source. In components, channels save you a few keystrokes (no need for 2 variables or 2 props for every signal). In classes they're even more necessary for keeping the code clean (see example below).

## `createSignal`

Wraps SolidJS `createSignal` in `createChannel`. Basically, creates a reactive channel.

```js
class User {
  name = createSignal('')

  constructor() {
    createEffect(() => {
      const result = validateName(this.name())
      if (result !== true) this.name('Anonymous')
    })
  }
}
```

Note: there is a better solution for forms and validation in `@durudex-web/form`

## Re-exported from Solid

- primitives: `createMemo`, `createEffect`, `createLazyMemo`, `createMutable` (store)
- tracking: `on`, `untrack`
- components: `For`, `Show`
- lifecycle: `onMount`, `onCleanup`

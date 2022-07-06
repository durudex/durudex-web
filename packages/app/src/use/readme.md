# `use*` functions

These functions are composed of some lifecycle hooks and reactive primitives like `createSignal`/`onMount`/`onCleanup`.

Note that they should not contain any domain logic, only some general things like styling etc.

## `useBodyClass`

Set some classes to body while a component is alive.

## `useBodyStyle`

Same, but set arbitrary styles instead.

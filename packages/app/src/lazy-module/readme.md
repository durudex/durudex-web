# Lazy module loader

`lazyModule` takes a function that asynchronously imports a module (basically returns a Promise of object), and returns a proxy object "containing" this module's exported components wrapped in SolidJS `lazy` function.

```jsx
const {A, B, C} = lazyModule(() => import('$/something'))

// then somewhere in the template
() => <A/>
```

Note that this module currently does not have support for passing props.

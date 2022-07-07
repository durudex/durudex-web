# Forms

This module implements simple form library with validation provided by the `validator` submodule (they work together fine but are not coupled).

```jsx
import {createForm} from '@durudex-web/form'
import {Validators} from '@durudex-web/validator'

const [form, {username, email, password}] = createForm(define => ({
  username: define(''),
  email: define(''),
  password: define(''),
}))

Validators.nonEmpty.run(username.error, username.value)

<>
  <Input value={username.value} error={username.error} />
</>
```

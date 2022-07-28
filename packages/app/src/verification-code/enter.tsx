import {Setter, signal} from 'solid-verba'
import {showNotification} from '$/notifications/api'
import {Submit} from '$/auth/submit/submit'

import {runWithOwner, Owner} from 'solid-js'

export function enterVerificationCode(value: Setter<number>, owner: Owner) {
  return runWithOwner(owner, async () => {
    const localValue = signal<number | null>(0)
    const pending = signal(false)
    const blocked = signal(false)

    await showNotification(close => ({
      title: <h1>Verification Code</h1>,
      body: (
        <div class="column">
          <p>
            Enter the verification code we've sent to your email and then click
            Submit.
          </p>
          <VerificationCodeInput blocked={blocked} value={localValue} />
        </div>
      ),
      actions: (
        <div class="row">
          <Submit blocked={blocked()} pending={pending} onSubmit={close}>
            Submit
          </Submit>
        </div>
      ),
    }))

    value(localValue()!)
  })
}

function VerificationCodeInput(props: any) {
  return null
}

type VerificationCodeInputProps = {value: Setter<number>}

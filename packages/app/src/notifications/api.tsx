/*
 * Copyright © 2022 Durudex
 *
 * This file is part of Durudex: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Durudex is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Durudex. If not, see <https://www.gnu.org/licenses/>.
 */

import {Element} from '$/props'
import {NotificationProps, notifications} from '$/notifications/root'

export type NotificationConfig = (close: () => void) => NotificationProps

export async function showNotification(config: NotificationConfig) {
  let close = () => {}
  const notificationLife = new Promise<void>(resolve => (close = resolve))

  const props = config(close)
  notifications.push(props)

  await notificationLife
  notifications.splice(notifications.indexOf(props))
}

function Dismiss(props: {close: () => void}) {
  return (
    <button class="button full-width" onClick={props.close}>
      Dismiss
    </button>
  )
}

export function showMessage(title: string, body: Element) {
  return showNotification(close => ({
    title: <h3>{title}</h3>,
    body,
    actions: <Dismiss close={close} />,
  }))
}

export function showError(body: Element) {
  return showNotification(close => ({
    title: <h3>Error</h3>,
    body,
    actions: <Dismiss close={close} />,
  }))
}

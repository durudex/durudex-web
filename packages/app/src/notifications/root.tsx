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

import '$/notifications/root.sass'

import {Element} from '$/props/props'
import {createMutable, Show} from '@durudex-web/lib'

export interface NotificationProps {
  title: Element
  body: Element
  actions: Element
}

export const notifications = createMutable<NotificationProps[]>([])

export function NotificationsRoot() {
  return (
    <Show when={notifications[0]}>
      <div class="notificationsRoot">
        <Notification {...notifications[0]} />
      </div>
    </Show>
  )
}

function Notification(props: NotificationProps) {
  return (
    <div class="notification">
      <div class="notification__title">{props.title}</div>
      <div class="notification__body">{props.body}</div>
      <div class="notification__actions">{props.actions}</div>
    </div>
  )
}

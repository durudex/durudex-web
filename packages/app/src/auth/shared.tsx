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

import '$/auth/shared.sass'

import {useBodyClass, useBodyStyle} from '$/use/body'
import {WithChildren, WithClass, classes} from '$/props/props'
import durudexLogo from '$/assets/logo.png'

const GRADIENT = 'linear-gradient(245.03deg, #9D1CED 8.14%, #1C24ED 92.58%)'

type AuthPageProps = WithChildren & WithClass

export function AuthPage(props: AuthPageProps) {
  useBodyClass('withAuthPage')
  useBodyStyle('background', GRADIENT)

  return <div class={classes(props, 'authPage')}>{props.children}</div>
}

type AuthScreenProps = AuthPageProps & {
  title: string
  paneLeftwards: boolean
  paneSrc: string
}

export function AuthScreen(props: AuthScreenProps) {
  return (
    <AuthPage
      class={`authScreen ${props.paneLeftwards ? 'authScreen_inverse' : ''}`}
    >
      <div class={classes(props, 'authScreen__body')}>
        <h1 class="authScreen__title">{props.title}</h1>
        <div class="authScreen__content column justify-between">
          {props.children}
        </div>
      </div>
      <div
        class="authScreen__pane"
        style={{'background-image': `url(${props.paneSrc})`}}
      >
        <img
          src={durudexLogo}
          alt="Durudex Logo"
          class="authScreen__paneLogo"
        />
      </div>
    </AuthPage>
  )
}

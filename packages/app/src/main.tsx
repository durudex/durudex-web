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

import '$/styles/app.sass'

import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'

import {render} from 'solid-js/web'
import {Router, Routes, Route, hashIntegration} from 'solid-app-router'
import {NotificationsRoot} from '$/notifications/root'
import {lazyModule} from '$/lazy-module/lazy-module'

const {AuthHome, SignIn, SignUp} = lazyModule(() => import('$/auth'))
const {Home} = lazyModule(() => import('$/home/home'))

function App() {
  return (
    <Router source={hashIntegration()}>
      <Routes>
        <Route path="/" element={() => <Home />} />
        <Route path="/auth">
          <Route path="/" element={() => <AuthHome />} />
          <Route path="/sign-in" element={() => <SignIn />} />
          <Route path="/sign-up" element={() => <SignUp />} />
        </Route>
      </Routes>
      <NotificationsRoot />
    </Router>
  )
}

render(() => <App />, document.body)

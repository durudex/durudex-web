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

import {createState} from '@durudex-web/flow'

type ShowError = (error: string) => void | Promise<void>

export const access = createState<string | null>(null)
export const refresh = createState<string | null>(null)
export const showError = createState<ShowError>(() => {
  const msg = 'showError not specified'
  alert(msg)
  throw new Error(msg)
})

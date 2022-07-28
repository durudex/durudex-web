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

import {createClient} from '@urql/core'

export type ShowError = (error: string) => void | Promise<void>

export interface Config {
  access: string | null
  refresh: string | null
  showError: ShowError
}

export const config: Config = {
  access: null,
  refresh: null,
  showError() {
    const msg = 'showErr not configured'
    alert(msg)
    throw new Error(msg)
  },
}

const apiUrl = (import.meta as any).env.PROD
  ? 'https://api.dev.durudex.com/query'
  : '/dev-api'

export const client = createClient({url: apiUrl})

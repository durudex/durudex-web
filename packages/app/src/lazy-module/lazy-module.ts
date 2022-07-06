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

import {lazy, Component} from 'solid-js'

type PickComponents<Module> = {
  [Key in keyof Module as Module[Key] extends Component
    ? Key
    : never]: Module[Key]
}

/**
 * `solid-js/lazy` wrapper for modules with multiple exports.
 */
export function lazyModule<Exports extends Record<string, Component>>(
  importer: () => Promise<Exports>
): PickComponents<Exports> {
  return new Proxy({} as any, {
    get(_, key) {
      if (typeof key !== 'string') throw new Error('Key must be a string')

      async function getSyntheticModule() {
        const mod: any = await importer()
        const exp = mod[key] as Component
        return {default: exp}
      }

      return lazy(getSyntheticModule)
    },
  })
}

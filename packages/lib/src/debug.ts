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

const w = Object.assign(window, {__forceDebugInProd: false})

export function log<T extends object>(getId?: (o: T) => string) {
  return function (target: T, key: string, descriptor: PropertyDescriptor) {
    const method = `${target.constructor.name}..${key}`
    if (import.meta.env.PROD) {
      const at = import.meta.url
      console.warn(`debug not removed in production: method ${method} at ${at}`)
      if (!w.__forceDebugInProd) return
    }

    const backup = descriptor.value
    descriptor.value = function (...args: any) {
      const objId = getId?.(this as any)
      if (objId) {
        console.group(`${method} (${objId})`)
      } else console.group(method)

      try {
        const result = backup.apply(this, args)
        if (result !== undefined) {
          console.log('returned:')
          console.dir(result)
        } else console.log('ok, returned nothing')
        console.groupEnd()
        return result
      } catch (error) {
        console.error('fail:')
        console.dir(error)
        console.groupEnd()
        throw error
      }
    }
  }
}

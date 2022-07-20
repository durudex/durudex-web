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

import {
  Channel,
  createSignal,
  createLazyMemo,
  log,
  createEffect,
} from '@durudex-web/lib'

export class Form<Schema extends {} = {}> {
  private fields = new Map<string, Field>()
  pending = createSignal<boolean>(false)

  add<K extends keyof Schema>(key: K, value: Field<Schema[K]>) {
    this.fields.set(key as string, value)
    return this
  }

  private getField(key: string) {
    const val = this.fields.get(key)
    if (!val) {
      throw new Error(`Missing key: ${key}`)
    }
    return val
  }

  struct = createLazyMemo<Schema | null>(() => {
    const obj: any = {}

    for (const key of this.fields.keys()) {
      const field = this.getField(key)
      if (field.error()) return null
      obj[key] = field.value()
    }

    return obj
  })

  block() {
    return this.pending() || this.struct() === null
  }

  assert(): Schema {
    const res = this.struct()
    if (res === null) throw new Error('Form is invalid')
    return res!
  }

  propagateErrors(rec: Record<string, string>) {
    for (const key in rec) {
      this.getField(key).error(rec[key])
    }
  }

  reset() {
    for (const [, field] of this.fields) {
      field.reset()
    }
  }
}

export class Field<T = any> {
  value: Channel<T>
  error = createSignal<string>('')

  constructor(private initial: T, public name: string = '') {
    this.value = createSignal(initial)
  }

  reset() {
    this.value(this.initial)
    this.error('')
  }
}

type Define = <Value>(value: Value) => Field<Value>
type SchemaToDefs<Schema> = {
  [K in keyof Schema]: Field<Schema[K]>
}

export function createForm<Schema>(
  getDefinitions: (define: Define) => SchemaToDefs<Schema>
) {
  const form = new Form<Schema>()

  const defs = getDefinitions(val => new Field(val))

  for (const key in defs) {
    form.add(key, defs[key])
    defs[key].name = key
  }

  return [form, defs] as const
}

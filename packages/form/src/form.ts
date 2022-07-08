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

import {Channel, createSignal, createMemo} from '@durudex-web/flow'

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

  unwrap = createMemo<Schema | null>(() => {
    const obj: any = {}
    for (const key of this.fields.keys()) {
      const field = this.getField(key)
      if (field.error()) return null
      obj[key] = field.value()
    }
    return obj
  })

  isValid() {
    return !this.pending() && !!this.unwrap()
  }

  assert(): Schema {
    if (!this.isValid()) throw new Error('Form is invalid')
    return this.unwrap()!
  }

  propagateErrors(rec: Record<string, string>) {
    for (const key in rec) {
      this.getField(key).error(rec[key])
    }
  }
}

export class Field<T = any> {
  value: Channel<T>
  error = createSignal<string>('')

  constructor(private initial: T) {
    this.value = createSignal(initial)
  }

  reset() {
    this.value(this.initial)
  }
}

type Definitions = Record<string, Field<any>>
type Define = <Value>(value: Value) => Field<Value>
type DefinitionsToSchema<D extends Definitions> = {
  [K in keyof D]: D[K] extends Field<infer F> ? F : never
}

export function createForm<D extends Definitions>(
  getDefinitions: (define: Define) => D
) {
  const form = new Form<DefinitionsToSchema<D>>()

  const defs = getDefinitions(val => new Field(val))

  for (const key in defs) {
    form.add(key, defs[key])
  }

  return [form, defs] as const
}

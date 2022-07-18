import {test, expect} from 'vitest'

import {resultOfUrql} from '../src/api-result'
import {OperationResult, CombinedError} from '@urql/core'

function make<T>(data: Partial<OperationResult<T>>): OperationResult<T> {
  return {operation: null as any, ...data}
}

const thing = Symbol()

test('operation', async () => {
  const ok = resultOfUrql(make({data: thing}))
  expect(ok.data).toBe(thing)
  const err = resultOfUrql(make({error: new CombinedError({})}))
  expect(err.data).toBe(null)
  expect(err.errors).toEqual([])
})

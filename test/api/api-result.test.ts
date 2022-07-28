import '@durudex-web/api-server/start'

import {resultOfUrql} from '@durudex-web/api/src/api-result'
import {OperationResult, CombinedError} from '@urql/core'

function make<T>(data: Partial<OperationResult<T>>): OperationResult<T> {
  return {operation: null as any, ...data}
}

const thing = Symbol()

test('resultOfUrql (ok)', () => {
  const ok = resultOfUrql(make({data: thing}))
  expect(ok.data).toBe(thing)
  expect(ok.errors).toBe(null)
})

test('resultOfUrql (err)', () => {
  const err = resultOfUrql(make({error: new CombinedError({})}))
  expect(err.data).toBe(null)
  expect(err.errors).toEqual([])
})

test('resultOfUrql (variableErrors)', () => {
  const error = new CombinedError({
    graphQLErrors: [{message: 'Invalid Email'}],
  })
  const res = resultOfUrql(make({error}))

  expect(res.data).toBe(null)
  expect(res.errors).toEqual([])
  expect(res.variableErrors).toEqual({email: 'Invalid Email'})
})

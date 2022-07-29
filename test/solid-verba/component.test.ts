import {classes} from 'solid-verba'

test('classes', () => {
  const empty = classes({}, '')
  expect(empty).toBe(' ')

  const custom = classes({class: 'custom'})
  expect(custom).toBe(' custom')

  const base = classes({}, 'base')
  expect(base).toBe('base ')

  const both = classes({class: 'custom'}, 'base')
  expect(both).toBe('base custom')
})

import {Comparator} from './types'

const w = Object.assign(window, {__forceDebugInProd: false})

type Decorator<Host, T> = (
  target: Host,
  property: string,
  descriptor: TypedPropertyDescriptor<T>
) => void

export function log<Host extends object>(
  getId?: (o: Host) => string
): Decorator<Host, (...args: any) => any> {
  return function (target, property, descriptor) {
    const method = `${target.constructor.name}..${property}`
    if ((import.meta as any).env.PROD) {
      const at = import.meta.url
      if (w.__forceDebugInProd === false) {
        console.warn(
          `debug not removed in production: method ${method} at ${at}`
        )
        return
      }

      const backup = descriptor.value!
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
}

// todo:
// export function memoize<Host, Result>(
//   compare?: Comparator<Result>
// ): Decorator<Host, () => Result> {
//   return (_target, _property, descriptor) => {
//     const backup = descriptor.value!
//   }
// }

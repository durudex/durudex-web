import {Comparator} from './types'
// import {memo} from './reactivity'

const w = Object.assign(globalThis, {__forceDebugInProd: false})

type Decorator<Host = object, T = any> = (
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

// does not work:
// export function memoize<T>(equals?: Comparator<T>): Decorator {
//   return (_target, property, descriptor: TypedPropertyDescriptor<() => T>) => {
//     const backup = descriptor.value!

//     const instances = new WeakMap<object, Map<string, () => any>>()

//     descriptor.value = function (this: object) {
//       let methodsMap = instances.get(this)
//       if (methodsMap === undefined) {
//         methodsMap = new Map()
//         instances.set(this, methodsMap)
//       }

//       let method = methodsMap.get(property)
//       if (method === undefined) {
//         method = memo(backup.bind(this), undefined, {})
//         methodsMap.set(property, method)
//       }

//       return method()
//     }
//   }
// }

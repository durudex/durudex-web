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
          console.info('returned:')
          console.dir(result)
        } else console.info('ok, returned nothing')
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

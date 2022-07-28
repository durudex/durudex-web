export type Awaitable<T = void> = T | Promise<T>
export type Defined = {} | null

export type Getter<T> = () => T
export type Setter<T> = (next: T) => T
export type Channel<T> = (next?: T) => T
export type Mapper<I, O = I> = (input: I) => O
export type Action = () => void
export type Comparator<T> = false | ((a: T, b: T) => boolean)

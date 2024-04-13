export type Consumer<T> = (p:T) => void
export type Supplier<T> = () => T

import { mergeProps } from 'solid-js'

type KeyOfOptionals<T> = keyof {
  [K in keyof T as T extends Record<K, T[K]> ? never : K]: T[K]
}

export function withDefaults<P extends Record<string, any>>(
  props: P,
): <D extends Partial<P>>(defaults: keyof D extends KeyOfOptionals<P> ? D : never) => P & D {
  // eslint-disable-next-line solid/reactivity
  return defaults => mergeProps(defaults, props)
}

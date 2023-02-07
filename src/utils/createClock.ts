import { createSignal, onCleanup } from 'solid-js'

export default () => {
  const [clock, setClock] = createSignal(0)
  let last = performance.now()
  const tick = () => {
    setClock(c => c + 1)
    last = performance.now()
  }
  return {
    clock,
    start: (fps: number) => {
      const interval = setInterval(tick, fps)
      onCleanup(() => clearInterval(interval))
    },
  }
}

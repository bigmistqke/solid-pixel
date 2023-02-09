import { createSignal, onCleanup } from 'solid-js'

export default (fps = 33.3333) => {
  const [clock, setClock] = createSignal(0)
  let last = performance.now()
  const tick = () => {
    setClock(c => c + 1)
    last = performance.now()
  }
  let interval: NodeJS.Timer
  return {
    clock,
    start: () => {
      if (interval) clearInterval(interval)
      interval = setInterval(tick, fps)
      onCleanup(() => clearInterval(interval))
    },
    stop: () => {
      if (interval) clearInterval(interval)
    },
    tick,
  }
}

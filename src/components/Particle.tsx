import { createEffect, createSignal, mergeProps, on, Show } from 'solid-js'
import lerp from '../utils/lerp'
import { withDefaults } from '../utils/withDefaults'
import { General, Rectangle, useDisplay, Vector } from '../index'

export type ParticleProps = {
  lifespan?: number
  position?: Vector
  startDirection?: Vector | [Vector, Vector]
  endDirection?: Vector | [Vector, Vector]
  startOpacity?: number
  endOpacity?: number
}

export default (props: ParticleProps & Partial<General>) => {
  const defaults = {
    lifespan: 100,
    position: [10, 10],
    startDirection: [0, 0],
    endDirection: [0, 0],
    startOpacity: 1,
    endOpacity: 0,
  } satisfies ParticleProps
  const merged = withDefaults(props)(defaults)
  const context = useDisplay()

  const [isAlive, setIsAlive] = createSignal(true)
  const [lifespan, setLifespan] = createSignal(0)
  const incrementLifespan = () => setLifespan(l => l + 1)

  const [direction, setDirection] = createSignal(merged.startDirection)
  const [position, setPosition] = createSignal(merged.position)
  const [opacity, setOpacity] = createSignal(merged.startOpacity)

  createEffect(
    on(
      () => context.clock,
      () => {
        incrementLifespan()

        const r1 = Math.random()
        const r2 = Math.random()

        const start =
          Array.isArray(merged.startDirection[0]) && Array.isArray(merged.startDirection[1])
            ? ([
                lerp(merged.startDirection[0][0], merged.startDirection[0][1], r1),
                lerp(merged.startDirection[1][0], merged.startDirection[1][1], r1),
              ] as Vector)
            : merged.startDirection

        const end =
          Array.isArray(merged.endDirection[0]) && Array.isArray(merged.endDirection[1])
            ? ([
                lerp(merged.endDirection[0][0], merged.endDirection[0][1], r1),
                lerp(merged.endDirection[1][0], merged.endDirection[1][1], r1),
              ] as Vector)
            : merged.endDirection
        if (!end) {
          setDirection(start)
        } else {
          setDirection(() => [
            lerp(start[0], end[0], lifespan() / merged.lifespan),
            lerp(start[1], end[1], lifespan() / merged.lifespan),
          ])
        }
        setPosition(([x, y]) => [x + direction()[0], y + direction()[1]])
        setOpacity(() => lerp(merged.startOpacity, merged.endOpacity, lifespan() / merged.lifespan))
        if (merged.lifespan === lifespan()) {
          setIsAlive(false)
        }
      },
    ),
  )

  return (
    <Show when={isAlive()}>
      <Rectangle
        position={[Math.floor(position()[0]), Math.floor(position()[1])]}
        dimensions={[1, 1]}
        opacity={opacity()}
        onCollision={props.onCollision}
        collision={props.collision}
        data={props.data}
      />
    </Show>
  )
}

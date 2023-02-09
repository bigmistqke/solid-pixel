import { createEffect, createSignal, mergeProps, onCleanup } from 'solid-js'
import { blend, BlendMode } from '../utils/color'
import { Color, General, useDisplay, Vector } from '../index'
import { colord } from 'colord'

export type RectangleProps = {
  position: Vector | (() => Vector)
  dimensions: Vector
  color: Color
  opacity: number
  blendMode: BlendMode
  displacement: Vector | ((uv: Vector) => Vector)
}

export default (props: Partial<RectangleProps & General>) => {
  const merged = mergeProps(
    {
      opacity: 1,
      position: [0, 0] as Vector,
      dimensions: [5, 5] as Vector,
      color: 'white',
      blendMode: 'default' as BlendMode,
      displacement: [0, 0] as Vector,
    },
    props,
  )
  const context = useDisplay()

  createEffect(() => console.log('color changed', merged.color, props.color))

  onCleanup(() => console.log('cleaned up for some reason'))

  const drawRectangle = () => {
    // console.log('props.color', props.color.r)
    if (merged.dimensions[0] === 0 && merged.dimensions[1] === 0) return
    let collisions = new Set<unknown>()

    let start = typeof merged.position === 'function' ? merged.position() : merged.position
    const end = [
      start[0] + (merged.dimensions[0] - 1),
      start[1] + (merged.dimensions[1] - 1),
    ] as const
    const delta = [start[0] - end[0], start[1] - end[1]] as const
    const root = [
      start[0] < end[0] ? start[0] : end[0],
      start[1] < end[1] ? start[1] : end[1],
    ] as Vector

    for (let x = 0; x < Math.abs(delta[0]) + 1; x++) {
      for (let y = 0; y < Math.abs(delta[1]) + 1; y++) {
        const displacement =
          typeof merged.displacement === 'function'
            ? merged.displacement([x, y])
            : merged.displacement

        const offset = [root[0] + x + displacement[0], root[1] + y + displacement[1]] as Vector

        if (!context.inBounds?.(offset)) continue

        let next =
          typeof merged.color === 'function'
            ? merged.color(
                [offset[0] - start[0], offset[1] - start[1]],
                context.matrix?.[offset[0] - start[0]]?.[offset[1] - start[1]]?.color || 'black',
              )
            : merged.color

        const current = context?.matrix?.[root[0] + x]?.[root[1] + y]
        const rgba = blend(current?.color, next, merged.opacity, merged.blendMode)
        const position = [root[0] + x, root[1] + y] as Vector
        if (!rgba) return

        if (current?.collision && merged.collision) {
          collisions.add(current.data)
        }

        // console.log(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1)`)

        context.setPixel?.(position, {
          color: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1)`,
          // color: merged.color,
          onHover: merged.onHover,
          onClick: merged.onClick,
          pointerEvents: merged.pointerEvents,
          collision: merged.collision,
          data: merged.data,
          // alpha: current.alpha + merged.opacity,
        })
      }
    }
    if (merged.onCollision) {
      merged.onCollision?.(collisions)
    }
  }

  context.onFrame?.(() => drawRectangle())
  return <></>
}

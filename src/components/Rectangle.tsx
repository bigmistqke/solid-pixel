import { mergeProps } from 'solid-js'
import { blend, BlendMode } from '../utils/color'
import { Color, General, useDisplay, Vector } from '../index'
import { colord } from 'colord'

export type RectangleProps = {
  position: Vector
  dimensions: Vector
  color: Color
  opacity: number
  blendMode: BlendMode
}

export default (props: Partial<RectangleProps & General>) => {
  const merged = mergeProps(
    {
      opacity: 1,
      position: [0, 0] as Vector,
      dimensions: [5, 5] as Vector,
      color: 'white',
      blendMode: 'default' as BlendMode,
    },
    props,
  )
  const context = useDisplay()

  const drawRectangle = () => {
    const start = merged.position
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
        const offset = [root[0] + x, root[1] + y] as Vector

        if (!context.inBounds?.(offset)) continue

        let next =
          typeof merged.color === 'function'
            ? merged.color([offset[0] - merged.position[0], offset[1] - merged.position[1]])
            : merged.color

        const current = context?.matrix?.[root[0] + x]?.[root[1] + y]
        const rgba = blend(current?.color, next, merged.opacity, merged.blendMode)
        const position = [root[0] + x, root[1] + y] as Vector
        if (!rgba) return

        if (current?.collision && merged.onCollision) {
          merged.onCollision(current.data)
        }

        context.setPixel?.(position, {
          color: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1)`,
          onHover: merged.onHover,
          onClick: merged.onClick,
          pointerEvents: merged.pointerEvents,
          collision: merged.collision,
          data: merged.data,
        })
      }
    }
  }

  context.onFrame?.(() => drawRectangle())
  return <></>
}

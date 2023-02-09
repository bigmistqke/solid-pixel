import { mergeProps } from 'solid-js'
import { blend, BlendMode } from '../utils/color'
import { Color, General, useDisplay, Vector } from '../index'
import { colord } from 'colord'

export type CircleProps = {
  position: Vector
  radius: number
  color: Color
  opacity?: number
  blendMode?: BlendMode
}

export default (props: CircleProps & Partial<General>) => {
  const defaults = {
    opacity: 1,
    blendMode: 'default',
    position: [0, 0],
    radius: 3,
    color: 'white',
  } satisfies CircleProps
  const merged = mergeProps(defaults, props)
  const context = useDisplay()

  const distance = (pixel: Vector) =>
    Math.sqrt(Math.pow(pixel[0] - props.position[0], 2) + Math.pow(pixel[1] - props.position[1], 2))

  const drawCircle = () => {
    let collisions = new Set()
    for (let x = 0; x < merged.radius * 2; x++) {
      for (let y = 0; y < merged.radius * 2; y++) {
        const pixel = [
          merged.position[0] + x - merged.radius,
          merged.position[1] + y - merged.radius,
        ] as Vector

        if (!context.inBounds?.(pixel)) continue
        if (distance(pixel) >= merged.radius) continue
        const current = context.matrix?.[pixel[0]]?.[pixel[1]]

        let next =
          typeof merged.color === 'function'
            ? merged.color(
                [pixel[0] - props.position[0], pixel[1] - props.position[1]],
                current?.color,
              )
            : merged.color

        if (merged.blendMode) {
          const color = blend(
            current?.color || { r: 0, g: 0, b: 0 },
            next,
            merged.opacity,
            merged.blendMode,
          )
          if (!color) return

          if (current?.collision && merged.collision) {
            collisions.add(current.data)
          }

          context.setPixel?.(pixel, {
            color: `rgb(${color.r}, ${color.g}, ${color.b})`,
            onHover: props.onHover,
            onClick: props.onClick,
            collision: props.collision,
            data: props.data,
          })
        }
      }
    }
    if (merged.onCollision) {
      merged.onCollision?.(collisions)
    }
  }

  context.onFrame?.(drawCircle)
  return <></>
}

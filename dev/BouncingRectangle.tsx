import { createSignal, mergeProps } from 'solid-js'
import { RectangleProps } from 'src/components/Rectangle'
import { BlendMode, Rectangle, useDisplay, Vector } from '../src'

export default (props: Partial<RectangleProps> & { dimensions?: Vector; position?: Vector }) => {
  const merged = mergeProps(
    {
      dimensions: [10, 10] as Vector,
      position: [0, 0] as Vector,
      color: 'white',
      blendMode: 'default' as BlendMode,
      opacity: 1,
    },
    props,
  )
  const context = useDisplay()

  const [position, setPosition] = createSignal<Vector>(merged.position)
  const [direction, setDirection] = createSignal<Vector>([-1, 1])

  const nextPosition = () =>
    [position()[0] - direction()[0], position()[1] - direction()[1]] as Vector

  const animate = () => {
    if (!context || context.matrix.length === 0) return
    const p = nextPosition()
    if (p[0] < 0 || p[0] + merged.dimensions[0] >= context.matrix.length) {
      setDirection(value => [value[0] * -1, value[1]])
    }
    if (p[1] < 0 || p[1] + merged.dimensions[1] >= context.matrix[0]!.length) {
      setDirection(value => [value[0], value[1] * -1])
    }
    setPosition(nextPosition())
  }

  context.onFrame?.(animate)

  return (
    <Rectangle
      position={position()}
      dimensions={merged.dimensions}
      color={merged.color}
      blendMode={merged.blendMode}
      opacity={merged.opacity}
    />
  )
}

import { createSignal, mergeProps } from 'solid-js'
import { CircleProps } from '../src/components/Circle'
import { BlendMode, Circle, General, useDisplay, Vector } from '../src'

export default (props: Partial<CircleProps & General> & { direction: [1 | -1, 1 | -1] }) => {
  const merged = mergeProps(
    {
      radius: 5,
      position: [5, 5] as Vector,
      direction: [1, 1],
      color: 'white',
      blendMode: 'default' as BlendMode,
      opacity: 1,
    },
    props,
  )

  const context = useDisplay()

  const [position, setPosition] = createSignal<Vector>(merged.position)
  const [direction, setDirection] = createSignal<Vector>(merged.direction)

  const nextPosition = () =>
    [position()[0] - direction()[0], position()[1] - direction()[1]] as Vector

  context.onFrame?.(() => {
    if (context.matrix.length === 0) return
    const p = nextPosition()
    if (p[0] - merged.radius + 2 < 0 || p[0] + merged.radius - 1 > context.matrix.length)
      setDirection(value => [value[0] * -1, value[1]])
    if (p[1] - merged.radius + 2 < 0 || p[1] + merged.radius - 1 > context.matrix[0]!.length)
      setDirection(value => [value[0], value[1] * -1])

    setPosition(nextPosition())
  })

  return (
    <Circle
      position={position()}
      onHover={merged.onHover}
      onClick={merged.onClick}
      radius={merged.radius}
      color={merged.color}
      blendMode={merged.blendMode}
      opacity={0.7}
    />
  )
}

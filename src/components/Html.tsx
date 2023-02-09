import { createEffect, createMemo, createSignal, JSX, mergeProps, on } from 'solid-js'
import { Portal } from 'solid-js/web'
import { RectangleProps } from './Rectangle'
import { BlendMode, Color, General, Rectangle, useDisplay, Vector } from '../'

export default (
  props: Partial<RectangleProps> & {
    dimensions?: Vector
    position?: Vector
    component: JSX.Element
    background?: Color
    style: JSX.CSSProperties
  } & Partial<General>,
) => {
  const merged = mergeProps(
    {
      dimensions: [10, 10] as Vector,
      position: [0, 0] as Vector,
      color: 'white',
      blendMode: 'default' as BlendMode,
      opacity: 1,
      background: 'black',
    },
    props,
  )
  const context = useDisplay()

  const dimensions = createMemo<Vector>(() => [
    (merged.dimensions[0] - 1) * (context.pixelDimensions?.[0] || 0),
    (merged.dimensions[1] - 1) * (context.pixelDimensions?.[1] || 0),
  ])

  const position = createMemo<Vector>(() => [
    merged.position[0] * (context.pixelDimensions?.[0] || 0),
    merged.position[1] * (context.pixelDimensions?.[1] || 0),
  ])

  const [p, setP] = createSignal<Vector>([0, 0])
  const [d, setD] = createSignal<Vector>([0, 0])

  createEffect(
    on(position, () => {
      context.nextFrame?.(() => {
        setP(position())
      })
    }),
  )
  createEffect(
    on(dimensions, () => {
      context.nextFrame?.(() => {
        setD(dimensions())
      })
    }),
  )

  return (
    <>
      <Portal>
        <div
          style={{
            position: 'absolute',
            'z-index': 10,
            left: p()[0] + 'px',
            top: p()[1] + 'px',
            width: d()[0] + 'px',
            height: d()[1] + 'px',
            'pointer-events': 'none',
            ...props.style,
          }}
        >
          {props.component}
        </div>
      </Portal>
      <Rectangle
        position={merged.position}
        dimensions={[merged.dimensions[0] - 1, merged.dimensions[1] - 1]}
        color={merged.background}
        blendMode={merged.blendMode}
        opacity={merged.opacity}
        collision={merged.collision}
        onCollision={merged.onCollision}
        data={merged.data}
      />
    </>
  )
}

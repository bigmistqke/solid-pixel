import { colord } from 'colord'
import { createSignal, For } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useDisplay, useClock, Vector, Display, Rectangle, Particle, Text } from '../../src'

export default () => {
  const SIZE = 10

  const context = useDisplay()
  const { clock, start } = useClock()
  start(1000 / 30)

  context.onFrame?.(() => {})

  const [width, setWidth] = createSignal(Math.floor(window.innerWidth / SIZE))
  const [height, setHeight] = createSignal(Math.floor(window.innerHeight / SIZE))

  window.addEventListener('resize', () => {
    setWidth(Math.floor(window.innerWidth / SIZE))
    setHeight(Math.floor(window.innerHeight / SIZE))
  })

  const [particles, setParticles] = createSignal<{ position: Vector; direction: Vector }[]>([])

  const createObstacles = () =>
    new Array(20).fill('').map(v => ({
      size: 10,
      position: [
        Math.floor(Math.random() * (width() - 10)),
        Math.floor(Math.random() * (height() - 10)),
      ] as Vector,
    }))

  const [obstacles, setObstacles] = createStore(createObstacles())

  return (
    <>
      <Display
        width={width()}
        height={height()}
        clock={clock()}
        pixelStyle={{
          margin: '2px',
          height: SIZE - 4 + 'px',
          width: SIZE - 4 + 'px',
          'border-radius': '2px',
        }}
        background={(uv, color) => {
          return colord(color).desaturate(0.1).darken(0.05).toRgbString()
        }}
        onClick={(pixel, context) => {
          const c = context.cursor
          if (c)
            setParticles(p => [
              ...p,
              { position: c, direction: [Math.random() - 0.5, Math.random() - 0.5] },
            ])
        }}
      >
        <For each={obstacles}>
          {(obstacle, index) => (
            <Rectangle
              position={[
                obstacle.position[0] - Math.floor((obstacle.size / 2) * Math.sin(clock() / 10)),
                obstacle.position[1] - Math.floor((obstacle.size / 2) * Math.cos(clock() / 10)),
              ]}
              dimensions={[obstacle.size, obstacle.size]}
              collision
              data={index()}
              color={uv => {
                return colord({
                  r: (Math.cos((uv[0] + obstacle.size + context.clock) / 10) + 0.5) * 200,
                  g: (Math.sin((uv[1] + obstacle.size / 10 + context.clock) / 10) + 0.5) * 200,
                  b: 200,
                }).toRgbString()
              }}
            />
          )}
        </For>
        <For each={particles()}>
          {({ position, direction }) => (
            <Particle
              position={position}
              startDirection={direction}
              collision
              onCollision={data => {
                data.forEach(value => {
                  if (value === 'particle' || obstacles[value] === undefined) return
                  setObstacles(value, 'size', s => Math.max(0, s - 1))
                })
              }}
              data="particle"
            />
          )}
        </For>
        <Text text="HALLO" shadowPosition={[1, 0]} shadowColor="red" />
      </Display>
    </>
  )
}

import { createSignal, createEffect, Show } from 'solid-js'
import { useClock, useDisplay, Vector, Rectangle, Circle, Display, Text } from '../../src'

export default () => {
  const SIZE = 10

  const { clock, start } = useClock()
  start(1000 / 30)

  const [width, setWidth] = createSignal(Math.floor(window.innerWidth / SIZE))
  const [height, setHeight] = createSignal(Math.floor(window.innerHeight / SIZE))

  const App = () => {
    const context = useDisplay()

    window.addEventListener('resize', () => {
      setWidth(Math.floor(window.innerWidth / SIZE))
      setHeight(Math.floor(window.innerHeight / SIZE))
    })

    type Arrow = 1 | -1
    type Direction = [Arrow, Arrow]

    const [position, setPosition] = createSignal<[number, number]>([3, 3])

    const [direction, setDirection] = createSignal<Direction>([1, 1])
    const [radius, setRadius] = createSignal<number>(4)
    const [gameOver, setGameOver] = createSignal<boolean>(false)

    const nextPosition = () =>
      [position()[0] - direction()[0], position()[1] - direction()[1]] as Vector

    context.onFrame?.(() => {
      if (gameOver()) return
      if (context.matrix.length === 0) return
      const p = nextPosition()
      if (p[0] - radius() + 2 < 0 || p[0] + radius() - 1 > context.matrix.length)
        setDirection(value => [(value[0] * -1) as Arrow, value[1]])
      if (p[1] - radius() + 2 < 0 || p[1] + radius() - 1 > context.matrix[0]!.length)
        setDirection(value => [value[0], (value[1] * -1) as Arrow])

      setPosition(nextPosition())
    })

    createEffect(() => {
      if (!gameOver()) {
        setScore(0)
        setPosition([Math.floor(context.dimensions[0] * Math.random()), 3])
        setDirection(d => [Math.random() > 0.5 ? -1 : 1, d[0]])
      }
    })

    const Player = () => (
      <>
        <Rectangle
          color="white"
          dimensions={[6, 6]}
          position={context.cursor ? [context.cursor[0] - 3, context.dimensions[1] - 8] : [0, 0]}
        />
        <Rectangle
          color="white"
          dimensions={[6, 1]}
          position={context.cursor ? [context.cursor[0] - 3, context.dimensions[1] - 9] : [0, 0]}
          collision
          data="playerTop"
        />
        <Rectangle
          color="white"
          dimensions={[1, 6]}
          position={context.cursor ? [context.cursor[0] - 3, context.dimensions[1] - 8] : [0, 0]}
          collision
          data="playerSides"
        />
        <Rectangle
          color="white"
          dimensions={[1, 6]}
          position={context.cursor ? [context.cursor[0] + 2, context.dimensions[1] - 8] : [0, 0]}
          collision
          data="playerSides"
        />
      </>
    )

    return (
      <>
        <Show
          when={gameOver()}
          fallback={<Text position={[1, 1]} text={'score ' + score()} color="white" />}
        >
          <Text text="game over" position={[1, 1]} />
          <Text
            position={[1, 9]}
            text="play again"
            background="white"
            color="red"
            onClick={() => setGameOver(false)}
          />
        </Show>
        <Rectangle
          color="red"
          dimensions={[context.dimensions[0], 1]}
          position={[0, context.dimensions[1] - 1]}
          collision
          data="lava"
        />
        <Player />

        <Circle
          position={position()}
          radius={4}
          color="white"
          opacity={1}
          blendMode="default"
          collision
          data={'circle'}
          onCollision={collisions => {
            if (collisions.size > 0) {
              if (collisions.has('lava')) {
                setGameOver(true)
                setDirection(v => [v[0], (v[1] * -1) as Arrow])
              } else if (isColliding()) {
                return
              } else if (collisions.has('playerSides')) {
                setScore(score => score + 2)
                setDirection(v => [(v[0] * -1) as Arrow, (v[1] * -1) as Arrow])
              } else {
                setScore(score => score + 1)
                setDirection(v => [v[0], (v[1] * -1) as Arrow])
              }
              setIsColliding(true)
            } else {
              setIsColliding(false)
            }
          }}
        />
      </>
    )
  }

  const [score, setScore] = createSignal(0)
  const [isColliding, setIsColliding] = createSignal(false)

  return (
    <>
      <Display
        width={width()}
        height={height()}
        clock={clock()}
        pixelStyle={{
          padding: '2px',
          // height: SIZE + 'px',
          // width: SIZE + 'px',
          // 'border-radius': '2px',
        }}
      >
        <App />
      </Display>
    </>
  )
}

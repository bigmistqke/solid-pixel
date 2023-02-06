import { Component, createEffect, createSignal, Index, onCleanup, Show } from 'solid-js'
import { Display, Marquee, useDisplay, Text, WrappedText, Rectangle, Circle, Vector } from '../src'
import font from '../src/fonts/mono'
import styles from './App.module.css'
import BouncingCircle from './BouncingCircle'
import BouncingRectangle from './BouncingRectangle'

const Example1 = () => {
  const context = useDisplay()
  return (
    <>
      <Index each={Array(6).fill('')}>
        {(_, i) => (
          <>
            <Marquee
              text="goodbye world "
              font={font}
              position={context ? [context?.dimensions[0] - 1, 1 + (i - 1) * 16] : [0, 0]}
              color={'white'}
              reverse
            />
            <Marquee
              text="hello world "
              font={font}
              position={[1, 1 + (i - 1) * 16 + 8]}
              color={'red'}
            />
          </>
        )}
      </Index>

      <BouncingCircle position={[50, 10]} direction={[1, 1]} color="blue" />
      <BouncingCircle
        position={[20, 20]}
        direction={[1, 1]}
        radius={20}
        color={uv => {
          const rgb = `rgb(${(Math.cos((uv[0] + context.clock) / 10) + 0.5) * 200}, ${
            (Math.sin((uv[1] + context.clock) / 10) + 0.5) * 200
          }, 200)`
          return rgb
        }}
        blendMode={'difference'}
      />
      <BouncingRectangle dimensions={[20, 20]} blendMode="lighten" color="red" />
    </>
  )
}

const Example2 = () => {
  const context = useDisplay()

  const [text, setText] = createSignal(
    'hello to the world goodbye to the sky hello to the world goodbye to the sky hello to the world goodbye to the sky hello to the world goodbye to the sky hello to the world goodbye to the sky hello to the world goodbye to the sky v hello to the world goodbye to the sky hello to the world goodbye to the sky hello to the world goodbye to the sky',
  )
  const t = 'hello to the world goodbye to the sky '.split('')
  let counter = 0

  setInterval(() => {
    setText(text => text + t[counter % t.length])
    counter++
  }, 100)

  const [color, setColor] = createSignal('blue')
  const [color2, setColor2] = createSignal('red')
  return (
    <>
      <BouncingCircle
        color={color()}
        radius={20}
        position={[30, 30]}
        direction={[-1, 1]}
        onClick={() => {
          setColor(`rgb(${Math.random() * 250}, ${Math.random() * 250},${Math.random() * 250})`)
        }}
      />
      <Text
        text={text()}
        font={font}
        position={[2, 2]}
        color={uv => {
          const rgb = `rgb(${(Math.cos((uv[0] + context.clock) / 10) + 0.5) * 200}, ${
            (Math.sin((uv[1] + context.clock) / 10) + 0.5) * 200
          }, 200)`
          return rgb
        }}
        wrap="word"
        scroll="vertical"
        // blendMode="default"
        pointerEvents={false}
        // background="blue"
      />
      <BouncingCircle
        color={color2()}
        radius={10}
        position={[10, 10]}
        direction={[1, -1]}
        // blendMode="add"
        // opacity={0.5}
        onClick={() => {
          setColor2(`rgb(${Math.random() * 250}, ${Math.random() * 250},${Math.random() * 250})`)
        }}
      />
    </>
  )
}

const Example3 = () => {
  const context = useDisplay()

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

  const [score, setScore] = createSignal(0)
  const [isColliding, setIsColliding] = createSignal(false)

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

const App: Component = () => {
  const [clock, setClock] = createSignal(0)
  let last = performance.now()

  const tick = () => {
    setClock(c => c + 1)
    last = performance.now()
  }

  const interval = setInterval(() => tick(), 1000 / 30)
  onCleanup(() => clearInterval(interval))

  const SIZE = 15

  const [width, setWidth] = createSignal(Math.floor(window.innerWidth / SIZE))
  const [height, setHeight] = createSignal(Math.floor(window.innerHeight / SIZE))

  window.addEventListener('resize', () => {
    setWidth(Math.floor(window.innerWidth / SIZE))
    setHeight(Math.floor(window.innerHeight / SIZE))
  })

  return (
    <div class={styles.App}>
      <header class={styles.header}>
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
          background={uv => {
            const x = (Math.cos(uv[0] / 10) + 0.5) * 20
            const y = (Math.sin(uv[1] / 10) + 0.5) * 20

            const rgb = `rgb(${x}, ${y}, 100)`
            return rgb
          }}
        >
          <Example3 />
        </Display>
      </header>
    </div>
  )
}

export default App

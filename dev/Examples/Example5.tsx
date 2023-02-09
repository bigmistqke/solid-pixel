import { colord } from 'colord'
import BouncingCircle from '../BouncingCircle'
import { createSignal } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { useDisplay, useClock, Vector, Display, Text } from '../../src'
import { Matrix } from '../../src/components/Display'

export default () => {
  const SIZE = 15

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
    new Array(3).fill('').map(v => ({
      size: 10,
      position: [
        Math.floor(Math.random() * (width() - 10)),
        Math.floor(Math.random() * (height() - 10)),
      ] as Vector,
    }))

  const [obstacles, setObstacles] = createStore(createObstacles())

  const convolve = (
    matrix: Matrix,
    setMatrix: SetStoreFunction<Matrix>,
    wind = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  ) => {
    const result = JSON.parse(JSON.stringify(matrix)) as Matrix
    let color

    matrix.forEach((column, x) =>
      column.forEach((_, y) => {
        let sum = { r: 0, g: 0, b: 0 }
        let totalWeight = 0
        wind.forEach((row, xWind) =>
          row.forEach((weight, yWind) => {
            color =
              matrix[x + xWind - Math.floor(wind.length / 2)]?.[
                y + yWind - Math.floor(row.length / 2)
              ]?.color
            if (color) {
              color = colord(color).toRgb()
              totalWeight += weight
              sum = {
                r: sum.r + color.r * weight,
                g: sum.g + color.g * weight,
                b: sum.b + color.b * weight,
              }
            }
          }),
        )
        sum = {
          r: sum.r / totalWeight,
          g: sum.g / totalWeight,
          b: sum.b / totalWeight,
        }
        result[x]![y]!.color = colord(sum).toRgbString()
      }),
    )
    result.forEach((column, x) =>
      column.forEach((pixel, y) => {
        setMatrix(x, y, 'color', pixel.color)
      }),
    )
  }

  const [wind, setWind] = createSignal([
    [0.2, 0.2, 0.2, 0.2],
    [0.2, 1.0, 1.0, 0.2],
    [0.2, 1.0, 1.0, 0.2],
    [0.2, 0.2, 0.2, 0.2],
  ])

  return (
    <>
      <Display
        width={width()}
        height={height()}
        clock={clock()}
        pixelStyle={{
          padding: '2px',
          height: SIZE + 'px',
          width: SIZE + 'px',
          // 'border-radius': '2px',
        }}
        /* background={(uv, color) => {
          return colord(color).desaturate(0.1).darken(0.05).toRgbString()
        }} */
        onClick={(pixel, context) => {
          const c = context.cursor
          if (c)
            setParticles(p => [
              ...p,
              { position: c, direction: [Math.random() - 0.5, Math.random() - 0.5] },
            ])
        }}
        postProcess={(matrix, setMatrix) => convolve(matrix, setMatrix, wind())}
      >
        <BouncingCircle
          position={[20, 20]}
          radius={6}
          direction={[-1, 1]}
          color={uv => {
            const rgb = `rgb(${(Math.cos((uv[0] + context.clock) / 10) + 0.5) * 200}, ${
              (Math.sin((uv[1] + context.clock) / 10) + 0.5) * 200
            }, 200)`
            return rgb
          }}
        />
        <Text text="CONVOLUTION" shadowPosition={[1, 0]} shadowColor="red" position={[1, 1]} />
        <Text
          text="1"
          shadowPosition={[1, 0]}
          shadowColor="red"
          position={[5, 10]}
          onClick={() =>
            setWind([
              [0.2, 0.2, 0.2],
              [0.2, 1.0, 0.2],
              [0.2, 0.2, 0.2],
            ])
          }
        />
        <Text
          text="2"
          shadowPosition={[1, 0]}
          shadowColor="red"
          position={[15, 10]}
          onClick={() =>
            setWind([
              [0.2, 0.2, 0.2, 0.2, 0.2],
              [0.2, 0.5, 0.5, 0.5, 0.2],
              [0.2, 0.5, 1.0, 0.5, 0.2],
              [0.2, 0.5, 0.5, 0.5, 0.2],
              [0.2, 0.2, 0.2, 0.2, 0.2],
            ])
          }
        />
        <Text
          text="3"
          shadowPosition={[1, 0]}
          shadowColor="red"
          position={[25, 10]}
          onClick={() =>
            setWind([
              [0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1],
              [0.2, 0.3, 0.5, 0.5, 0.5, 0.5, 0.2],
              [0.2, 0.3, 0.5, 0.7, 0.5, 0.5, 0.3],
              [0.2, 0.3, 0.5, 1.0, 0.5, 0.5, 0.4],
              [0.3, 0.5, 0.7, 0.7, 1.0, 0.5, 0.3],
              [0.2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.2],
              [0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1],
            ])
          }
        />
        <Text
          text="none"
          shadowPosition={[1, 0]}
          shadowColor="red"
          position={[35, 10]}
          onClick={() => setWind([[1]])}
        />
      </Display>
    </>
  )
}

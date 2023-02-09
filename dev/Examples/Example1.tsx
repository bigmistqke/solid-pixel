import { createSignal, Index } from 'solid-js'
import { Display, Marquee, useClock } from '../../src'
import BouncingCircle from '../BouncingCircle'
import BouncingRectangle from '../BouncingRectangle'

import font from '../../src/fonts/mono'

export default () => {
  const SIZE = 10

  const { clock, start } = useClock()
  start(1000 / 30)

  const [width, setWidth] = createSignal(Math.floor(window.innerWidth / SIZE))
  const [height, setHeight] = createSignal(Math.floor(window.innerHeight / SIZE))

  window.addEventListener('resize', () => {
    setWidth(Math.floor(window.innerWidth / SIZE))
    setHeight(Math.floor(window.innerHeight / SIZE))
  })

  return (
    <Display
      width={width()}
      height={height()}
      clock={clock()}
      pixelStyle={{
        margin: '2px',
        height: SIZE - 4 + 'px',
        width: SIZE - 4 + 'px',
        // 'border-radius': '2px',
      }}
    >
      <Index each={Array(5).fill('')}>
        {(_, i) => (
          <>
            <Marquee
              text="goodbye world "
              font={font}
              position={width() ? [width() - 1, 1 + i * 16] : [0, 0]}
              color={'white'}
              reverse
            />
            <Marquee text="hello world " font={font} position={[1, 1 + i * 16 + 8]} color={'red'} />
          </>
        )}
      </Index>

      <BouncingCircle position={[50, 10]} direction={[1, 1]} color="blue" />
      <BouncingCircle
        position={[20, 20]}
        direction={[1, 1]}
        radius={20}
        color={uv => {
          const rgb = `rgb(${(Math.cos((uv[0] + clock()) / 10) + 0.5) * 200}, ${
            (Math.sin((uv[1] + clock()) / 10) + 0.5) * 200
          }, 200)`
          return rgb
        }}
        blendMode={'difference'}
      />
      <BouncingRectangle dimensions={[20, 20]} blendMode="lighten" color="red" />
    </Display>
  )
}

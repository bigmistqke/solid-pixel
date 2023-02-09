import BouncingCircle from 'dev/BouncingCircle'
import { createSignal } from 'solid-js'
import { useDisplay, useClock, Display, Text } from '../../src'

import font from '../../src/fonts/mono'

export default () => {
  const context = useDisplay()
  const SIZE = 10

  const { clock, start } = useClock()
  start(1000 / 30)

  const [width, setWidth] = createSignal(Math.floor(window.innerWidth / SIZE))
  const [height, setHeight] = createSignal(Math.floor(window.innerHeight / SIZE))

  window.addEventListener('resize', () => {
    setWidth(Math.floor(window.innerWidth / SIZE))
    setHeight(Math.floor(window.innerHeight / SIZE))
  })

  const [text, setText] = createSignal('hello to the world goodbye to the sky ')
  const t = 'hello to the world goodbye to the sky '.split('')
  let counter = 0

  setInterval(() => {
    setText(text => text + t[counter % t.length])
    counter++
  }, 100)

  const [color, setColor] = createSignal('blue')
  const [color2, setColor2] = createSignal('red')

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
        blendMode="default"
        pointerEvents={false}
        // background="blue"
      />
      <BouncingCircle
        color={color2()}
        radius={10}
        position={[10, 10]}
        direction={[1, -1]}
        blendMode="default"
        opacity={0.5}
        onClick={() => {
          setColor2(`rgb(${Math.random() * 250}, ${Math.random() * 250},${Math.random() * 250})`)
        }}
      />
    </Display>
  )
}

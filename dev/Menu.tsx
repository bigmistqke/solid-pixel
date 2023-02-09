import { useNavigate } from '@solidjs/router'
import { createSignal, For } from 'solid-js'
import { useDisplay, useClock, Display, Rectangle, Text } from '../src'

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

  const color = () => ({ r: 250, g: 0, b: 0 })
  const navigate = useNavigate()

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
        }}
      >
        <For each={new Array(6).fill('')}>
          {(_, index) => (
            <Text
              text={+index() + 1}
              position={[index() * 8, 1]}
              onClick={() => navigate('/' + (index() + 1))}
            />
          )}
        </For>

        {/* <Rectangle dimensions={[10, 10]} color={'red'} /> */}
      </Display>
    </>
  )
}

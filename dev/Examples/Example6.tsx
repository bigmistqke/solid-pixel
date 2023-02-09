import { createSignal } from 'solid-js'
import { useDisplay, useClock, Display, Rectangle } from '../../src'

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
        <Rectangle dimensions={[10, 10]} color={'red'} />
      </Display>
    </>
  )
}

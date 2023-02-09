import BouncingRectangle from '../BouncingRectangle'
import { createEffect, createSignal } from 'solid-js'
import { useDisplay, useClock, Display, Rectangle, Html, Vector, Text } from '../../src'
import { colord } from 'colord'

const App = () => {
  const [position, setPosition] = createSignal<Vector>([10, 10])
  const context = useDisplay()

  const [imgIndex, setImgIndex] = createSignal(0)

  const imgs = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Smiley.svg/640px-Smiley.svg.png',
    'data:image/png;base64,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',

    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mr._Smiley_Face.svg/640px-Mr._Smiley_Face.svg.png',
    'https://st.depositphotos.com/1037178/2168/v/950/depositphotos_21688439-stock-illustration-smiley-vector-illustration-tongue-out.jpg',
  ]

  const incrementImgIndex = () => {
    setImgIndex(i => (i + 1) % imgs.length)
  }
  let shouldIncrement = false
  return (
    <>
      <Text text="HTML mixed with solid pixel" position={[2, 2]} wrap="word" />
      <BouncingRectangle collision data="bounce" />
      <Html
        collision
        component={
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'black',
              color: 'white',
              'font-size': '15pt',
              overflow: 'scroll',
              'pointer-events': 'all',
            }}
          >
            HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH
            PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED
            WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML
            MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS
            HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS HTML MIXED WITH PIXELS
          </div>
        }
        position={[2, context.dimensions[1] - 11]}
        dimensions={[50, 10]}
      />
      <Html
        component={
          <img
            src={imgs[imgIndex()]}
            style={{
              width: '100%',
              height: '100%',
              'object-fit': 'cover',
              'pointer-events': 'none',
            }}
          />
        }
        background="white"
        position={context.cursor ? [context.cursor[0] - 4, context.cursor[1] - 4] : [0, 0]}
        dimensions={[10, 10]}
        collision
        onCollision={data => {
          if (data.size === 0) {
            shouldIncrement = true
            return
          }
          if (!shouldIncrement) return
          incrementImgIndex()
          console.log(imgs[imgIndex()])
          shouldIncrement = false
        }}
      />
    </>
  )
}

export default () => {
  const SIZE = 12

  const { clock, start } = useClock()
  start()

  const [width, setWidth] = createSignal(Math.floor(window.innerWidth / SIZE))
  const [height, setHeight] = createSignal(Math.floor(window.innerHeight / SIZE))

  window.addEventListener('resize', () => {
    setWidth(Math.floor(window.innerWidth / SIZE))
    setHeight(Math.floor(window.innerHeight / SIZE))
  })

  return (
    <>
      <Display
        width={width()}
        height={height()}
        clock={clock()}
        pixelStyle={{
          margin: '1px',
          'box-sizing': 'border-box',
          height: 'calc(100% - 2px)',
          width: 'calc(100% - 2px)',
          overflow: 'hidden',
          'border-radius': '10px',
        }}
        background={(uv, current) => colord(current).darken(0.2).toRgbString()}
      >
        <App />
      </Display>
    </>
  )
}

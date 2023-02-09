import BouncingRectangle from '../BouncingRectangle'
import { createEffect, createSignal } from 'solid-js'
import { useDisplay, useClock, Display, Rectangle, Html, Vector, Text } from '../../src'
import { colord } from 'colord'

const App = () => {
  const [position, setPosition] = createSignal<Vector>([10, 10])
  const context = useDisplay()

  const [imgIndex, setImgIndex] = createSignal(0)

  const imgs = [
    'https://media.istockphoto.com/id/118337676/photo/water-surface-in-vibrant-blue.jpg?s=612x612&w=0&k=20&c=Q_-XmGnCgK4utVjh8ROlieUhtzVloI2w8KBDs0Ac7C8=',
    'https://img.freepik.com/premium-vector/sun-reflection-ocean-with-aqua-pattern_176411-1385.jpg?w=2000',
    'https://thumbs.dreamstime.com/b/seamless-water-texture-computer-graphic-big-collection-30043917.jpg',
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
              'box-shadow': '0px 0px 50px black',
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
        style={{
          'mix-blend-mode': 'darken',
        }}
        component={
          <img
            src={imgs[imgIndex()]}
            style={{
              width: '100%',
              height: '100%',
              'object-fit': 'cover',
              'pointer-events': 'none',
              'backdrop-filter': 'blur(50px)',
              'mix-blend-mode': 'difference',
              'z-index': 2,
            }}
          />
        }
        background="white"
        position={context.cursor ? [context.cursor[0] - 10, context.cursor[1] - 10] : [0, 0]}
        dimensions={[30, 30]}
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

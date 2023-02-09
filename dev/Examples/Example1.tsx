import BouncingCircle from 'dev/BouncingCircle'
import BouncingRectangle from 'dev/BouncingRectangle'
import { Index } from 'solid-js'
import { useDisplay, Marquee } from '../../src'

import font from '../../src/fonts/mono'

export default () => {
  const context = useDisplay()
  return (
    <>
      <Index each={Array(5).fill('')}>
        {(_, i) => (
          <>
            <Marquee
              text="goodbye world "
              font={font}
              position={context ? [context?.dimensions[0] - 1, 1 + i * 16] : [0, 0]}
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

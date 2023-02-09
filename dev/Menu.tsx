import { useNavigate } from '@solidjs/router'
import { createSignal, For } from 'solid-js'
import { Display, Text, useClock, useDisplay, Vector } from '../src'

const A = (props: { link: string; position: Vector }) => {
  const navigate = useNavigate()
  const [hover, setHover] = createSignal(false)

  return (
    <Text
      text={props.link}
      color={hover() ? 'red' : 'white'}
      position={props.position}
      onClick={() => navigate('/' + props.link)}
      onHover={setHover}
    />
  )
}

export default () => {
  const SIZE = 10

  const { clock, start } = useClock(1000 / 30)
  start()

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
        padding: '2px',
        height: SIZE + 'px',
        width: SIZE + 'px',
        'border-radius': '50%',
      }}
    >
      <Text text="solid pixel" position={[1, 1]} />
      <For each={new Array(6).fill('')}>
        {(_, index) => <A link={(+index() + 1).toString()} position={[index() * 8 + 1, 9]} />}
      </For>
    </Display>
  )
}

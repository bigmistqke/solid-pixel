import { createEffect, createMemo, createSignal, mergeProps } from 'solid-js'
import { useDisplay, Vector } from '../index'
import Text from './Text'

type Glyph = readonly string[]
type Font = { [key: string]: Glyph }

type Color = string | ((uv: Vector) => string)

type Props = {
  text: string
  font: Font
  position?: Vector
  color?: Color
  onFrame?: () => void
  reverse?: true
  speed?: number
}

export default (props: Props) => {
  const context = useDisplay()
  const merged = mergeProps({ speed: 1 }, props)

  const [text, setText] = createSignal(props.text)
  const [position, setPosition] = createSignal(props.position ?? ([0, 0] as Vector))

  const clock = createMemo(() => (context ? context.clock / merged.speed : undefined))

  const incrementPosition = () => {
    if (props.reverse) setPosition(pos => [pos[0] + 1, pos[1]])
    else setPosition(pos => [pos[0] - 1, pos[1]])
  }

  const updateText = () => {
    if (props.reverse) setText(t => t[t.length - 1] + t.slice(0, t.length - 1))
    else setText(t => t.slice(1, t.length) + t[0])
  }

  context.onFrame?.(() => {
    const char = props.reverse ? text()[text().length - 1] : text()[0]
    const glyph = char && props.font[char.toUpperCase()]
    const width = glyph && glyph[0]?.length
    if (!width) return
    incrementPosition()

    if (Math.abs(position()[0] - props.position![0]) > width) {
      updateText()
      setPosition(props.position ?? [0, 0])
    }
  })

  const length = createMemo(() => {
    const matrixWidth = context?.matrix.length
    if (!matrixWidth) return 0
    let stringWidth = 0
    props.text.split('').forEach(char => {
      const charWidth = props.font[char.toUpperCase()]?.[0]?.length
      if (charWidth) stringWidth += charWidth
    })

    return Math.ceil(matrixWidth / stringWidth)
  })

  const repeatedText = createMemo(() => {
    let t = text()
    for (let i = 1; i < length(); i++) {
      t += t
    }
    return t
  })

  return (
    <Text
      text={repeatedText()}
      font={props.font}
      position={position()}
      color={props.color}
      onFrame={props.onFrame}
      align={props.reverse ? 'right' : 'left'}
    />
  )
}

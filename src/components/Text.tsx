import { colord } from 'colord'
import { createEffect, createSignal, mergeProps } from 'solid-js'
import font from '../fonts/mono'
import { Color, General, useDisplay, Vector } from '../index'
import { blend, BlendMode, getColor } from '../utils/color'

export type Glyph = readonly string[]
export type Font = { [key: string]: Glyph }
export type TextAlign = 'left' | 'right'

export type TextProps = {
  text: string | number
  font: Font
  position: Vector
  color: Color
  background?: Color
  onFrame: () => void
  opacity: number
  blendMode: BlendMode
  align: TextAlign
  wrap: false | 'all' | 'word'
  scroll: false | 'vertical' | 'horizontal' | 'both'
  scrollSpeed: number
  shadowPosition: Vector
  shadowColor: Color
} & Partial<General>

export const drawGlyph = (
  glyph: Glyph | undefined,
  position: Vector,
  props: Partial<General> & {
    background?: Color
    color: Color
    align: TextAlign
    opacity: number
    blendMode: BlendMode
  },
  context: ReturnType<typeof useDisplay>,
) => {
  if (!glyph) return
  if (!context.matrix) return

  glyph.forEach((row, y) => {
    row += ' '
    let r = row.split('')
    if (props.align === 'right') r = r.reverse()
    r.forEach((pixel, x) => {
      const offset =
        props.align === 'right'
          ? ([position[0] - x, position[1] + y] as Vector)
          : ([position[0] + x, position[1] + y] as Vector)
      if (!context.inBounds?.(offset)) return
      const current = context.matrix[offset[0]]?.[offset[1]]
      if (pixel !== ' ') {
        const color = getColor(props.color, offset)
        const blendedColor = blend(current?.color, color, props.opacity, props.blendMode)
        if (!blendedColor) return
        context.setPixel?.(offset, {
          onHover: props.onHover,
          onClick: props.onClick,
          pointerEvents: props.pointerEvents,
          color: colord(blendedColor).toRgbString(),
        })
      } else if (props.background) {
        const color = getColor(props.background, offset)
        const blendedColor = blend(current?.color, color, props.opacity, props.blendMode)
        if (!blendedColor) return
        context.setPixel?.(offset, {
          onHover: props.onHover,
          onClick: props.onClick,
          pointerEvents: props.pointerEvents,
          color: colord(blendedColor).toRgbString(),
        })
      }
    })
  })
}

const drawText = (
  props: Partial<General> & TextProps,
  scroll: Vector,
  context: ReturnType<typeof useDisplay>,
) => {
  let offset = [Math.floor(props.position[0] + scroll[0]), Math.floor(props.position[1])] as Vector

  let words = props.text.toString().split(' ')
  if (props.align === 'right') words = words.reverse()
  words.forEach(word => {
    if (props.align === 'right') word = word.split('').reverse().join('')
    if (props.wrap === 'word') {
      const wordDimensions = getWordDimensions(word, props.font)
      if (offset[0] + wordDimensions[0] > context.dimensions[0]) {
        offset = [props.position[0], offset[1] + wordDimensions[1] + 1]
      }
    }
    const paddedWord = [...word.split(''), ' ']
    paddedWord.forEach(char => {
      const glyph = props.font[char.toUpperCase()]
      if (!glyph?.[0]) return
      if (props.wrap === 'all') {
        const glyphDimensions = getGlyphDimensions(glyph)
        if (offset[0] + glyphDimensions[0] + 1 > context.dimensions[0]) {
          offset = [props.position[0], offset[1] + glyphDimensions[1] + 1]
        }
      }
      drawGlyph(glyph, [offset[0], offset[1] + Math.floor(scroll[1])], props, context)
      if (glyph?.[0]) {
        if (props.align === 'right') offset[0] -= glyph[0]?.length + 1
        else offset[0] += glyph[0]?.length + 1
      }
    })
  })
}

export const getGlyphDimensions = (glyph: Glyph): Vector => [glyph[0]?.length ?? 0, glyph.length]
export const getWordDimensions = (word: string, font: Font) => {
  const glyphs = word.split('').map(char => font[char.toUpperCase()])
  let dimensions: Vector = [0, 0]
  glyphs.forEach(glyph => {
    if (!glyph) return
    const glyphDimensions = getGlyphDimensions(glyph)
    dimensions[0] += glyphDimensions[0] + 2
    if (dimensions[1] < glyphDimensions[1]) dimensions[1] = glyphDimensions[1]
  })
  return dimensions
}

export default (props: Partial<TextProps>) => {
  const defaults: TextProps = {
    text: '',
    font: font as Font,
    position: [0, 0] as Vector,
    align: 'left' as TextAlign,
    blendMode: 'default' as BlendMode,
    opacity: 1,
    color: 'white',
    scrollSpeed: 1,
    onFrame: () => {},
    wrap: false as const,
    scroll: false as const,
    shadowPosition: [0, 0],
    shadowColor: 'black',
  }
  defaults.shadowColor
  const merged = mergeProps(defaults, props)

  const [scroll, setScroll] = createSignal<Vector>([0, 0])

  const context = useDisplay()

  context.onWheel?.(event => {
    if (merged.scroll) setScroll(p => [p[0], p[1] + event.deltaY / (10 / 1)])
  })

  // const shadow = createMemo(() => ())

  context.onFrame?.(() => {
    props.onFrame?.()
    if (!(merged.shadowPosition[0] === 0 && merged.shadowPosition[1] === 0)) {
      drawText(
        {
          ...merged,
          color: merged.shadowColor,
          position: [
            merged.position[0] + merged.shadowPosition[0],
            merged.position[1] + merged.shadowPosition[1],
          ],
        },
        scroll(),
        context,
      )
    }
    drawText(merged, scroll(), context)
  })
  return <></>
}

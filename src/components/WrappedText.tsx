import { mergeProps } from 'solid-js'
import { Vector, Color } from '../'
import { useDisplay } from './Display'
import { TextProps, drawGlyph, Font, TextAlign } from './Text'

export default (props: TextProps & { width?: number }) => {
  const merged = mergeProps(
    { position: [0, 0] as Vector, align: 'left' as TextAlign, color: 'white' },
    props,
  )
  const context = useDisplay()

  const drawText = (text: string, font: Font, position: Vector) => {
    let offset = [...position] as Vector

    let t = text.split('')
    if (props.align === 'right') t = t.reverse()
    t.forEach(char => {
      const glyph = font[char.toUpperCase()]
      if (!glyph?.[0]) return
      const glyphDimensions = [glyph[0].length, glyph.length] as Vector
      if (offset[0] + glyphDimensions[0] + 1 > context.dimensions[0]) {
        offset = [merged.position[0], offset[1] + glyphDimensions[1] + 1]
      }

      drawGlyph(glyph, offset, merged, context)
      if (glyph?.[0]) {
        if (props.align === 'right') offset[0] -= glyph[0]?.length + 1
        else offset[0] += glyph[0]?.length + 1
      }
    })
  }
  context.onFrame?.(() => {
    props.onFrame?.()
    drawText(props.text, props.font, merged.position)
  })
  return <></>
}

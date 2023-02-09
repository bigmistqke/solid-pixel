import { colord } from 'colord'
import { Color, Vector } from 'src'
import lerp from './lerp'

export type BlendMode = 'default' | 'difference' | 'add' | 'subtract' | 'lighten' | 'darken'

type RGB = { r: number; g: number; b: number }

export const blend = (
  current: string | RGB | undefined,
  next: string | RGB,
  opacity: number,
  blendMode: BlendMode,
): RGB | undefined => {
  if (!next) return typeof current === 'string' ? colord(current).toRgb() : current
  current = current ? colord(current).toRgb() : { r: 0, g: 0, b: 0 }

  const currentIsBrightest = () => colord(current as RGB).brightness > colord(next).brightness

  if (!next) return current
  next = next ? colord(next).toRgb() : { r: 0, g: 0, b: 0 }

  switch (blendMode) {
    case 'add':
      return {
        r: Math.max(0, Math.min(250, current.r + next.r) * opacity),
        g: Math.max(0, Math.min(250, current.g + next.g) * opacity),
        b: Math.max(0, Math.min(250, current.b + next.b) * opacity),
      }
    case 'subtract':
      return {
        r: Math.max(0, Math.min(250, (current.r - (250 - next.r) * opacity) * -1)),
        g: Math.max(0, Math.min(250, (current.g - (250 - next.g) * opacity) * -1)),
        b: Math.max(0, Math.min(250, (current.b - (250 - next.b) * opacity) * -1)),
      }
    case 'difference':
      return currentIsBrightest()
        ? {
            r: Math.max(0, Math.min(250, (current.r - (250 - next.r) * opacity) * -1)),
            g: Math.max(0, Math.min(250, (current.g - (250 - next.g) * opacity) * -1)),
            b: Math.max(0, Math.min(250, (current.b - (250 - next.b) * opacity) * -1)),
          }
        : {
            r: Math.max(0, Math.min(250, (next.r - (250 - current.r) * opacity) * -1)),
            g: Math.max(0, Math.min(250, (next.g - (250 - current.g) * opacity) * -1)),
            b: Math.max(0, Math.min(250, (next.b - (250 - current.b) * opacity) * -1)),
          }
    case 'lighten':
      return currentIsBrightest() ? current : next
    case 'darken':
      return currentIsBrightest() ? next : current
    case 'default':
    default:
      return opacity === 1
        ? next
        : {
            r: lerp(current.r, next.r, opacity),
            g: lerp(current.g, next.g, opacity),
            b: lerp(current.b, next.b, opacity),
          }
  }
}

export const getColor = (color: Color, position: Vector) =>
  typeof color === 'function' ? color(position) : color

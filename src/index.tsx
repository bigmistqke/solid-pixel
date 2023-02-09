import { extend, RgbColor } from 'colord'
import namesPlugin from 'colord/plugins/names'
import Circle from './components/Circle'
import { Display, useDisplay } from './components/Display'
import Marquee from './components/Marquee'
import Particle from './components/Particle'
import Rectangle from './components/Rectangle'
import Text from './components/Text'
import WrappedText from './components/WrappedText'
import { BlendMode } from './utils/color'
import useClock from './utils/useClock'

extend([namesPlugin])

export type Vector = [number, number]
export type Color = string | ((uv: Vector, current: string) => string)
export type General = {
  onHover: (hover: boolean) => void
  onClick: () => void
  pointerEvents?: boolean
  collision?: boolean
  onCollision?: (collisions: Set<any>) => void
  data: any
}
export type { BlendMode }
export { Text, Rectangle, Marquee, Display, useDisplay, Circle, WrappedText, Particle, useClock }

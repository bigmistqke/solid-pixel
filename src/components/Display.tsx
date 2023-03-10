import { colord, RgbColor } from 'colord'
import {
  batch,
  Component,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  Index,
  JSX,
  JSXElement,
  mergeProps,
  on,
  onCleanup,
  useContext,
} from 'solid-js'
import { createStore, reconcile, SetStoreFunction } from 'solid-js/store'
import { Color, General, Vector } from 'src'
import { getColor } from '../utils/color'

import s from './Display.module.css'

export type Pixel = {
  color: string
} & Partial<General>
export type Matrix = Pixel[][]

type DisplayContextType = {
  matrix: Matrix
  setPixel?: (position: Vector, props: { color: string } & Partial<General>) => void
  dimensions: Vector
  pixelDimensions?: Vector
  clock: number
  cursor?: Vector
  inBounds?: (pos: Vector) => boolean
  onFrame?: (callback: (clock: number) => void) => void
  nextFrame?: (callback: (clock: number) => void) => void
  onWheel?: (callback: (event: WheelEvent) => void) => void
}

const DisplayContext = createContext<DisplayContextType>({
  clock: 0,
  dimensions: [0, 0],
  matrix: [],
})
export const useDisplay = () => useContext(DisplayContext)

type DisplayProps = {
  width: number
  height: number
  children: JSXElement
  clock: number
  background?: Color
  pixelStyle?: JSX.CSSProperties
  onClick?: (pixel: Pixel, context: DisplayContextType) => void
  postProcess?: (matrix: Matrix, setMatrix: SetStoreFunction<Matrix>) => void
}

export const Display: Component<DisplayProps> = props => {
  const merged = mergeProps({ background: 'black' }, props)
  const [matrix, setMatrix] = createStore<Matrix>([])
  const [cursor, setCursor] = createSignal<Vector>([0, 0])

  const setPixel = (position: Vector, props: { color: string } & Partial<General>) => {
    if (props.pointerEvents === undefined || props.pointerEvents)
      setMatrix(position[0], position[1], { ...props })
    else setMatrix(Math.floor(position[0]), Math.floor(position[1]), { color: props.color })
  }

  const clearDisplay = (color: Color) => {
    setMatrix(
      Array(props.width)
        .fill('')
        .map((_, x) =>
          Array(props.height)
            .fill('')
            .map((_, y) => ({
              color: getColor(color, [x, y]),
              // alpha: 0,
            })),
        ),
    )
  }

  const inBounds = (pos: Vector) =>
    pos[0] >= 0 && pos[1] >= 0 && pos[0] < getDimensions()[0] && pos[1] < getDimensions()[1]

  // RENDER
  const RenderQueue = new Set<(clock: number) => void>()
  const SingleQueue = new Set<(clock: number) => void>()

  const render = () => {
    console.time('render')
    batch(() => {
      console.time('display-render')
      clearDisplay(position => {
        // return 'black'
        const color = matrix[position[0]]?.[position[1]]?.color
        if (!color) return 'black'
        if (typeof merged.background === 'string') return merged.background
        else return merged.background(position, color)
      })
      console.timeEnd('display-render')

      RenderQueue.forEach(callback => callback(props.clock))
      if (props.postProcess) props.postProcess(matrix, setMatrix)
    })

    SingleQueue.forEach(callback => callback(props.clock))
    SingleQueue.clear()
    console.timeEnd('render')
  }

  createEffect(on(() => props.clock, render))
  render()

  // EVENTS
  const WheelQueue = new Set<(event: WheelEvent) => void>()
  const onWheel = (event: WheelEvent) =>
    batch(() => WheelQueue.forEach(callback => callback(event)))

  const onMouseMove = (event: MouseEvent) => {
    const element = document
      .elementsFromPoint(event.clientX, event.clientY)
      .filter(el => 'x' in (el as HTMLElement).dataset)[0]
    if (!element || !('dataset' in element)) return
    const { x, y } = element.dataset
    if (!x || !y) return
    setCursor([+x, +y])
  }

  const onMouseDown = (event: MouseEvent) => {
    hoveredPixel()?.onClick?.()
  }

  const [cursorStyle, setCursorStyle] = createSignal<'normal' | 'pointer'>('normal')

  const hoveredPixel = createMemo<Pixel | undefined>(previous => {
    const pixel = matrix[cursor()[0]]?.[cursor()[1]]
    if (pixel?.onHover !== previous?.onHover) {
      if (previous?.onHover) previous?.onHover?.(false)
      pixel?.onHover?.(true)
    }
    if (pixel?.onClick || pixel?.onHover) {
      setCursorStyle('pointer')
    } else {
      setCursorStyle('normal')
    }
    return pixel
  })

  createEffect(hoveredPixel)

  const getDimensions = () => [matrix.length, matrix[0]?.length ?? 0] as Vector

  const [context, setContext] = createStore<DisplayContextType>({
    get clock() {
      return props.clock
    },
    matrix,
    setPixel,
    inBounds,
    get cursor() {
      return cursor()
    },
    onFrame: callback => {
      RenderQueue.add(callback)
      onCleanup(() => RenderQueue.delete(callback))
    },
    nextFrame: callback => {
      SingleQueue.add(callback)
      onCleanup(() => SingleQueue.delete(callback))
    },
    get dimensions() {
      return getDimensions()
    },
    onWheel: callback => {
      WheelQueue.add(callback)
      onCleanup(() => WheelQueue.delete(callback))
    },
  })

  const onClick = () => {
    const h = hoveredPixel()
    if (!h || !props.onClick) return
    props.onClick?.(h, context)
  }

  let pixel: HTMLDivElement

  let timeout: NodeJS.Timeout

  const updatePixelDimensions = () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      const bounds = pixel.getBoundingClientRect()
      console.log([bounds.width, bounds.height])
      setContext('pixelDimensions', [bounds.width, bounds.height])
    }, 100)
  }

  createEffect(updatePixelDimensions)
  createEffect(on(() => [props.width, props.height], updatePixelDimensions))
  window.addEventListener('mousemove', onMouseMove)
  return (
    <DisplayContext.Provider value={context}>
      {props.children}
      <div
        onClick={onClick}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        classList={{ [s.pointer]: cursorStyle() === 'pointer' }}
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          'grid-template-columns': `repeat(${matrix.length}, 1fr)`,
          'grid-template-rows': `repeat(${matrix[0]?.length ?? 1}, 1fr)`,
          'grid-auto-flow': 'column',
        }}
      >
        <Index each={matrix}>
          {(row, x) => (
            <Index each={row()}>
              {(color, y) => (
                <div
                  ref={p => {
                    if (x === 0 && y === 0) pixel = p
                  }}
                  style={{
                    flex: 1,
                    display: 'inline-block',
                    'align-items': 'center',
                  }}
                  data-x={x}
                  data-y={y}
                >
                  <div
                    style={{
                      background: color()?.color,
                      /* width: '5px',
                      height: '5px', */
                      'pointer-events': 'none',
                      ...props.pixelStyle,
                    }}
                  />
                </div>
              )}
            </Index>
          )}
        </Index>
      </div>
    </DisplayContext.Provider>
  )
}

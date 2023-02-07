<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-pixel&background=tiles&project=%20" alt="solid-pixel">
</p>

# solid-pixel

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

■ A Solid Pixel Renderer ■

## Write JSX

```tsx
<Display>
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
</Display>
```

## Render Pixels

- marquee and different blend-modes

https://user-images.githubusercontent.com/10504064/216889302-f2fd0b73-5f5d-4dab-b07a-7b37dbb10823.mp4

- scrollable text, click-events and dynamic colors with color-callback

https://user-images.githubusercontent.com/10504064/216889713-e6280c61-26eb-4a51-9abb-31ed64651784.mp4

- collisions and simple game-loop

https://user-images.githubusercontent.com/10504064/216891022-610402ea-7788-48ec-b62d-54220c5d8770.mp4

- particles and feedback

https://user-images.githubusercontent.com/10504064/217265128-0261c8f8-8c58-4734-84b7-2c6f68fb4ff4.mp4

- text-shadow and convolution

https://user-images.githubusercontent.com/10504064/217322967-987a9c12-c7e5-485e-94f7-45e84ec6cbf6.mp4

## Components

- `<Display/>`
  - description
    - root-component
  - attributes:
    - background: `string | (uv: [number, number], current: string) => string`
    - width: `number`
    - height: `number`
    - children: `JSXElement`
    - clock: `number`
    - background: `string | (uv: [number, number], current: string) => string`
    - pixelStyle: `JSX.CSSProperties`
    - onClick: `(pixel: Pixel, context: DisplayContextType) => void`
    - postProcess: `(matrix: Matrix, setMatrix: StoreSetterFunction<Matrix>) => void`
- `<Rectangle/>`
  - description
    - draws a rectangle
  - attributes:
    - position: `[number, number] | (current: [number, number]) => [number, number]`
    - dimension: `[number, number] | (current: [number, number]) => [number, number]`
    - color: `string | (uv: [number, number], current: string) => string`
  - general attributes
    - opacity: `number`
    - blendMode: `"default" | "lighten" | "darken" | "add" | "subtract" | "difference"`
    - pointerEvents: `boolean`
    - onClick: `(uv: [number, number]) => void`
    - onHover: `(uv: [number, number]) => void`
    - collision: `boolean`
    - data: `any`
    - onCollision: `(collisions: Set<any>) => void`
- `<Circle/>`
  - description
    - draws a circle
  - attributes:
    - position: `[number, number] | (current: [number, number]) => [number, number]`
    - radius: `number`
    - color: `string | (uv: [number, number], current: string) => string`
  - general attributes
    - opacity: `number`
    - blendMode: `"default" | "lighten" | "darken" | "add" | "subtract" | "difference"`
    - pointerEvents: `boolean`
    - onClick: `(uv: [number, number]) => void`
    - onHover: `(uv: [number, number]) => void`
    - collision: `boolean`
    - data: `any`
    - onCollision: `(collisions: Set<any>) => void`
- `<Particle/>`
  - description
    - draws a particle
  - attributes:
    - position: `[number, number] | (current: [number, number]) => [number, number]`
    - radius: `number`
    - color: `string | (uv: [number, number], current: string) => string`
    - lifespan: `number`
    - position: `Vector`
    - startDirection: `Vector | [Vector, Vector]`
    - endDirection: `Vector | [Vector, Vector]`
    - startOpacity: `number`
    - endOpacity: `number`
  - general attributes
    - opacity: `number`
    - blendMode: `"default" | "lighten" | "darken" | "add" | "subtract" | "difference"`
    - pointerEvents: `boolean`
    - onClick: `(uv: [number, number]) => void`
    - onHover: `(uv: [number, number]) => void`
    - collision: `boolean`
    - data: `any`
    - onCollision: `(collisions: Set<any>) => void`
- `<Text/>`
  - description
    - draws text
  - attributes:
    - text: `string | number`
    - font: `Font` 👉 JSON-file containing pixel-font
    - position: `Vector`
    - color: `string | (uv: [number, number], current: string) => string`
    - background?: `string | (uv: [number, number], current: string) => string`
    - opacity: `number`
    - blendMode: `BlendMode`
    - align: `TextAlign`
    - wrap: `false | 'all' | 'word'`
    - scroll: `false | 'vertical' | 'horizontal' | 'both'`
    - scrollSpeed: `number`
  - general attributes
    - opacity: `number`
    - blendMode: `"default" | "lighten" | "darken" | "add" | "subtract" | "difference"`
    - pointerEvents: `boolean`
    - onClick: `(uv: [number, number]) => void`
    - onHover: `(uv: [number, number]) => void`
    - collision: `boolean`
    - data: `any`
    - onCollision: `(collisions: Set<any>) => void`

## Hook

- useDisplay

```tsx
const useDisplay = () => ({
  matrix: Pixel[][]
  setPixel: (position: Vector, props: { color: string } & Partial<General>) => void
  dimensions: Vector
  clock: number
  cursor: Vector
  inBounds: (pos: Vector) => boolean
  onFrame: (callback: (clock: number) => void) => void
  onWheel: (callback: (event: WheelEvent) => void) => void
})
```

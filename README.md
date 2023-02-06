<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-pixel&background=tiles&project=%20" alt="solid-pixel">
</p>

# solid-pixel

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

a pixel renderer

## Quick start

Install it:

```bash
npm i solid-pixel
# or
yarn add solid-pixel
# or
pnpm add solid-pixel
```

Use it:

```tsx
import solid-pixel from 'solid-pixel'
```


## Write JSX
``` tsx
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
```

## Render Pixels

https://user-images.githubusercontent.com/10504064/216889302-f2fd0b73-5f5d-4dab-b07a-7b37dbb10823.mp4

https://user-images.githubusercontent.com/10504064/216889713-e6280c61-26eb-4a51-9abb-31ed64651784.mp4

## Support for

- Shapes
  - Rectangle
  - Circle
- Text
  - Marquee
  - Wrap: `word` | `all`
  - Text-Scrolling
  - Fonts: custom pixel-fonts in JSON-format
- BlendModes
- Opacity
- Color
  - Static values
  - Callback: generate color per pixel
- Mouse-Events: `onHover` and `onClick`
- Collision-detection

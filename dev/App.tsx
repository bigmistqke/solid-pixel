import { Component } from 'solid-js'
import { Vector } from '../src'
import styles from './App.module.css'
import Example4 from './Examples/Example4'
import { Route, Router, Routes } from '@solidjs/router'
import Menu from './Menu'

const rainbow = (uv: Vector, clock: number) => {
  const rgb = `rgb(${(Math.cos((uv[0] + clock) / 10) + 0.5) * 200}, ${
    (Math.sin(uv[1] + clock) + 0.5) * 200
  }, 200)`
  return rgb
}

const SIZE = 15

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Router>
          <Routes>
            <Route path="/" component={Menu} />
            <Route path="/4" component={Example4} />
          </Routes>
        </Router>
      </header>
    </div>
  )
}

export default App

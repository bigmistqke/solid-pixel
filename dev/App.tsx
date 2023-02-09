import { Component } from 'solid-js'
import { Vector } from '../src'
import styles from './App.module.css'
import Example4 from './Examples/Example4'
import { Route, Router, Routes } from '@solidjs/router'
import Menu from './Menu'
import Example1 from './Examples/Example1'
import Example2 from './Examples/Example2'
import Example3 from './Examples/Example3'
import Example5 from './Examples/Example5'
import Example6 from './Examples/Example6'

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
            <Route path="/1" component={Example1} />
            <Route path="/2" component={Example2} />
            <Route path="/3" component={Example3} />
            <Route path="/4" component={Example4} />
            <Route path="/5" component={Example5} />
            <Route path="/6" component={Example6} />
          </Routes>
        </Router>
      </header>
    </div>
  )
}

export default App

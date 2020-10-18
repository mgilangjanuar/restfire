import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <ThemeSwitcherProvider defaultTheme={localStorage.getItem('theme') || 'dark'} themeMap={{ light: '/antd.min.css', dark: '/antd.dark.min.css' }}>
    <App />
  </ThemeSwitcherProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

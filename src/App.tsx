import { listen, TauriEvent } from '@tauri-apps/api/event'
import { Command } from '@tauri-apps/api/shell'
import { Layout } from 'antd'
import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import About from './pages/About'
import MyApp from './pages/App'
// import Pricing from './pages/Pricing'
import NotFoundPage from './pages/Error/404'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Thanks from './pages/Thanks'

import './App.css'

const cmd = Command.sidecar('../server/restfire-server')

cmd.spawn().then((child) => {
  listen(TauriEvent.WINDOW_DESTROYED, function () {
    child.kill()
  })
})

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/app/settings" exact><MyApp appRoute="/app/settings" /></Route>
          <Route path="/app/import" exact><MyApp appRoute="/app/import" /></Route>
          <Route path="/app/download" exact><MyApp appRoute="/app/download" /></Route>
          <Route path="/app"><MyApp appRoute="/app" /></Route>
          <Route path="/" exact>
            <Redirect to="/app" />
          </Route>
          {/* <Route path="/pricing" exact component={Pricing} /> */}
          <Route path="/about" exact component={About} />
          <Route path="/terms" exact component={Terms} />
          <Route path="/privacy" exact component={Privacy} />
          <Route path="/thanks" exact component={Thanks} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import { Layout } from 'antd'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import MyApp from './pages/App'
import Pricing from './pages/Pricing'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFoundPage from './pages/Error/404'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/app"><MyApp /></Route>
          <Route path="/" exact component={Home} />
          <Route path="/pricing" exact component={Pricing} />
          <Route path="/about" exact component={About} />
          <Route path="/terms" exact component={Terms} />
          <Route path="/privacy" exact component={Privacy} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}

export default App

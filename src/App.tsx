import React from 'react'
import { Layout } from 'antd'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './pages/Home'
import MyApp from './pages/App'
import NotFoundPage from './pages/Error/404'

import 'antd/dist/antd.dark.css'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/app" exact><MyApp route="/" /></Route>
          <Route path="/" exact component={Home} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}

export default App

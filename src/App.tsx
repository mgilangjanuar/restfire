import { MenuUnfoldOutlined, MenuFoldOutlined, FireOutlined, HomeOutlined, HistoryOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { Button, Layout, Menu, Typography } from 'antd'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

import Main from './pages/Main'
import NotFoundPage from './pages/Error/404'

import 'antd/dist/antd.dark.css'
import './App.css'

function App() {
  const [collapse, setCollapse] = useState<boolean>()

  const Title = ({ style = {}, useIcon = true, hideText = false }) => (
    <Typography.Title style={{ padding: '17px 5px 17px', marginBottom: 0, textAlign: 'center', ...style }} level={4}>
      { useIcon ? <FireOutlined /> : '' } { hideText ? '' : 'RestFire Studio' }
    </Typography.Title>
  )

  return (
    <BrowserRouter>
      <Layout>
        <Layout.Sider
          collapsible
          width={250}
          trigger={null}
          collapsed={collapse}
          onBreakpoint={e => setCollapse(e)}
          breakpoint="lg"
          collapsedWidth={0}
          style={{ overflow: 'auto', minHeight: '100vh' }}
        >
          <Title hideText={collapse} />
          <Menu mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key={1} icon={<HomeOutlined />}>
              <Link to="/">Main</Link>
            </Menu.Item>
            <Menu.Item key={2} icon={<HistoryOutlined />}>
              <Link to="/history">History</Link>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header style={{ padding: 0 }}>
            <Button type="text" onClick={() => setCollapse(!collapse)}>
              { collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
            </Button>
            <Title style={{ display: 'inline' }} useIcon={false} hideText={!collapse} />
          </Layout.Header>
          <Layout.Content style={{ margin: '24px 16px', padding: 24 }}>
            <Switch>
              <Route path="/" exact component={Main} />
              <Route component={NotFoundPage} />
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}

export default App

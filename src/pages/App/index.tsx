import { FireOutlined, HistoryOutlined, HomeOutlined, InfoCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, Typography } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import About from './About'
import Main from './Main'

interface Props {
  route: string
}

const App: React.FC<Props> = ({ route }) => {
  const [collapse, setCollapse] = useState<boolean>()

  const Title = ({ style = {}, useIcon = true, hideText = false }) => (
    <Typography.Title style={{ padding: '17px 5px 17px', marginBottom: 0, textAlign: 'center', ...style }} level={4}>
      { useIcon ? <FireOutlined /> : '' } { hideText ? '' : 'RestFire Studio' }
    </Typography.Title>
  )

  return (
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
            <Link to="/app">Main</Link>
          </Menu.Item>
          <Menu.Item key={2} icon={<HistoryOutlined />}>
            <Link to="/app/history">History</Link>
          </Menu.Item>
          <Menu.Item key={3} icon={<InfoCircleOutlined />}>
            <Link to="/app/about">About</Link>
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
        <Layout.Content style={{ margin: '7px 10px', padding: 24 }}>
          { route === '/' ? <Main /> : '' }
          { route === '/about' ? <About /> : '' }
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default App

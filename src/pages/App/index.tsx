import { FireOutlined, HistoryOutlined, HomeOutlined, InfoCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Empty, Layout, Menu, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import About from './About'
import History from './History'
import Main from './Main'

interface Props {
  route: string
}

const App: React.FC<Props> = ({ route }) => {
  const history = useHistory()
  const [collapse, setCollapse] = useState<boolean>()
  const [requestSent, setRequestSent] = useState<any>()
  const [histories, setHistories] = useState<any[]>(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : [])

  const Title = ({ style = {}, useIcon = true, hideText = false }) => (
    <Typography.Title style={{ padding: '17px 5px 17px', marginBottom: 0, textAlign: 'center', ...style }} level={4}>
      { useIcon ? <FireOutlined /> : '' } { hideText ? '' : 'RestFire Studio' }
    </Typography.Title>
  )

  const TitleHistory = ({ data }) => {
    let color: string | undefined = undefined
    if (data.request.method === 'post') {
      color = 'green'
    } else if (data.request.method === 'patch') {
      color = 'orange'
    } else if (data.request.method === 'put') {
      color = 'cyan'
    } else if (data.request.method === 'del') {
      color = 'red'
    } else if (data.request.method === 'opt') {
      color = 'lime'
    }

    const urlParsed = data.request.url?.split('?')[0]?.replace(/^http[s]*:\/\//gi, '')
    return <><Tag color={color}>{data.request.method?.toUpperCase()}</Tag> {urlParsed}</>
  }

  const sendRequest = async (req: any) => {
    history.push('/app')
    await new Promise(res => setTimeout(res, 100))
    setRequestSent(req)
  }

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
        <Menu mode="inline" defaultSelectedKeys={[route]} defaultOpenKeys={['/history']} theme="dark">
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/app">Main</Link>
          </Menu.Item>
          <Menu.SubMenu key="/history" icon={<HistoryOutlined />} title="History">
            { histories?.length ? histories?.map((req: any, i: number) => (
              <Menu.Item key={i} onClick={() => sendRequest(req)}>
                <TitleHistory data={req} />
              </Menu.Item>
            )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }
          </Menu.SubMenu>
          <Menu.Item key="/about" icon={<InfoCircleOutlined />}>
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
          { route === '/' ? <Main
            appendRequest={requestSent}
            onAppend={() => setRequestSent(undefined)}
            onSend={() => setHistories(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : [])} /> : '' }
          { route === '/history' ? <History /> : '' }
          { route === '/about' ? <About /> : '' }
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default App

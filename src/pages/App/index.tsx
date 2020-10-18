import { BulbOutlined, FireOutlined, HistoryOutlined, HomeOutlined, InfoCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Empty, Layout, Menu, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link, useHistory } from 'react-router-dom'
import About from './About'
import Main from './Main'

interface Props {
  route: string
}

const App: React.FC<Props> = ({ route }) => {
  const history = useHistory()
  const [collapseLeft, setCollapseLeft] = useState<boolean>()
  const [requestSent, setRequestSent] = useState<any>()
  const [histories, setHistories] = useState<any[]>(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : [])
  const [isDarkMode, setIsDarkMode] = useState<boolean>()
  const { switcher, themes } = useThemeSwitcher()

  useEffect(() => {
    let theme = window.localStorage.getItem('theme')
    if (!theme) {
      window.localStorage.setItem('theme', 'dark')
      theme = 'dark'
    }
    setIsDarkMode(theme === 'dark')
    switcher({ theme: theme === 'dark' ? themes.dark : themes.light })
  }, [switcher, themes])

  const Title = ({ style = {}, useIcon = true, hideText = false }) => (
    // <Typography.Title style={{ padding: '16px 5px 16px', marginBottom: 0, textAlign: 'center', ...style }} level={4}>
    //   { useIcon ? <FireOutlined /> : '' } { hideText ? '' : 'RestFire Studio' }
    // </Typography.Title>
    <span style={{ fontSize: '1.2em', padding: '16px 5px 16px', marginBottom: 0, textAlign: 'center', ...style }}>
      { useIcon ? <FireOutlined /> : '' } { hideText ? '' : 'RestFire Studio' }
    </span>
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
        width={350}
        trigger={null}
        collapsed={collapseLeft}
        onBreakpoint={e => setCollapseLeft(e)}
        breakpoint="lg"
        collapsedWidth={0}
        theme={isDarkMode ? 'dark' : 'light'}
        style={{ overflow: 'auto', minHeight: '100vh' }}
      >
        <Title hideText={collapseLeft} style={{ display: 'block', margin: '2px 0 1px' }} />
        <Menu mode="inline" defaultSelectedKeys={[route]} defaultOpenKeys={['/history']} theme={isDarkMode ? 'dark' : 'light'}>
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
        <Layout.Header style={{ padding: 0, ...isDarkMode ? {} : { backgroundColor: '#fff' } }}>
          <Button type="text" onClick={() => setCollapseLeft(!collapseLeft)}>
            { collapseLeft ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
          </Button>
          <Title style={{ display: 'inline' }} useIcon={false} hideText={!collapseLeft} />
          <Button style={{ float: 'right', top: '16px', right: '10px' }} type="text" icon={<BulbOutlined />} shape="circle" onClick={() => setIsDarkMode(prev => {
            switcher({ theme: prev ? themes.light : themes.dark })
            localStorage.setItem('theme', prev ? 'light' : 'dark')
            return !prev
          })} />
        </Layout.Header>
        <Layout.Content style={{ margin: '7px 10px', padding: 24 }}>
          { route === '/' ? <Main
            appendRequest={requestSent}
            onAppend={() => setRequestSent(undefined)}
            onSend={() => setHistories(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : [])} /> : '' }
          { route === '/about' ? <About /> : '' }
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default App

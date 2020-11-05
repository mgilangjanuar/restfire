import { DownloadOutlined, FireOutlined, HistoryOutlined, HomeOutlined, ImportOutlined, SettingOutlined } from '@ant-design/icons'
import { Empty, Layout, Menu, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link, useHistory } from 'react-router-dom'
import Header from '../../components/Header'
import Download from './Download'
import Import from './Import'
import Main from './Main'
import Settings from './Settings'

interface Props {
  appRoute: string
}

const App: React.FC<Props> = ({ appRoute }) => {
  const history = useHistory()
  const [route, setRoute] = useState<string>(appRoute || window.location.pathname)
  const [collapseLeft, setCollapseLeft] = useState<boolean>()
  const [requestSent, setRequestSent] = useState<any>()
  const [histories, setHistories] = useState<any[]>(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : [])
  const { currentTheme } = useThemeSwitcher()

  useEffect(() => {
    setRoute(appRoute || window.location.pathname)
  }, [appRoute])

  const Title = ({ style = {}, useIcon = true, hideText = false }) => (
    <span style={{ fontSize: '1.2em', padding: '16px 5px 16px', marginBottom: 0, textAlign: 'center', color: currentTheme === 'dark' ? '#fff' : '#000', ...style }}>
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

  const sendRequest = async (req: any, i?: number) => {
    history.push('/app')
    await new Promise(res => setTimeout(res, 100))
    if (i) {
      setRoute(`/app/${i}`)
    }
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
        theme={currentTheme as any || 'dark'}
        style={{ overflow: 'auto', minHeight: '100vh' }}
      >
        <Title hideText={collapseLeft} style={{ display: 'block', margin: '2px 0 1px' }} />
        <Menu mode="inline" defaultSelectedKeys={[route]} selectedKeys={[route]} defaultOpenKeys={['/app/history']} theme={currentTheme as any || 'dark'}>
          <Menu.Item key="/app" icon={<HomeOutlined />}>
            <Link to="/app" onClick={() => setRoute('/app')}>Main</Link>
          </Menu.Item>
          <Menu.Item key="/app/import" icon={<ImportOutlined />}>
            <Link to="/app/import" onClick={() => setRoute('/app/import')}>Import</Link>
          </Menu.Item>
          <Menu.Item key="/app/settings" icon={<SettingOutlined />}>
            <Link to="/app/settings" onClick={() => setRoute('/app/settings')}>Settings</Link>
          </Menu.Item>
          <Menu.SubMenu key="/app/history" icon={<HistoryOutlined />} title="History">
            { histories?.length ? histories?.map((req: any, i: number) => (
              <Menu.Item key={`/app/${i}`} onClick={() => sendRequest(req, i)}>
                <TitleHistory data={req} />
              </Menu.Item>
            )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }
          </Menu.SubMenu>
          <Menu.Item key="/app/download" icon={<DownloadOutlined />}>
            <Link to="/app/download" onClick={() => setRoute('/app/download')}>Desktop App</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Header withSidebar collapseLeft={[!!collapseLeft, setCollapseLeft]} />
        <Layout.Content style={{ padding: '0 20px' }}>
          { /^\/app[/]*[0-9]*$/.test(route) ? <Main
            appendRequest={requestSent}
            onAppend={() => setRequestSent(undefined)}
            onSend={() => setHistories(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : [])}
            goToSettings={() => setRoute('/app/settings')} /> : '' }
          { route === '/app/settings' ? <Settings /> : '' }
          { route === '/app/download' ? <Download /> : '' }
          { route === '/app/import' ? <Import onSendRequest={sendRequest} /> : '' }
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default App

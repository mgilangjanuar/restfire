import { AppstoreAddOutlined, DeleteOutlined, DownloadOutlined, FireOutlined, HistoryOutlined, HomeOutlined, ImportOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Empty, Form, Input, Layout, Menu, message, Popconfirm, Tag } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link, useHistory } from 'react-router-dom'
import { generate as createId } from 'shortid'
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
  const [collections, setCollections] = useState<any[]>(window.localStorage.getItem('collections') ? JSON.parse(window.localStorage.getItem('collections')!).sort((a, b) => a.title.localeCompare(b.title)) : [])
  const [isAddFolder, setIsAddFolder] = useState<boolean>(false)
  const [formNewFolder] = useForm()
  const { currentTheme } = useThemeSwitcher()

  useEffect(() => {
    setRoute(appRoute || window.location.pathname)
  }, [appRoute])

  const Title = ({ style = {}, useIcon = true, hideText = false }) => (
    <span style={{ fontSize: '1.2em', padding: '16px 5px 16px', marginBottom: 0, textAlign: 'center', color: currentTheme === 'dark' ? '#fff' : '#000', ...style }}>
      { useIcon ? <FireOutlined /> : '' } { hideText ? '' : 'RestFire Studio' }
    </span>
  )

  const TitleHistory = ({ data, col, i }) => {
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

    const urlParsed = data.name || data.request.url?.split('?')[0]?.replace(/^http[s]*:\/\//gi, '')
    return <>
      <span onClick={() => sendRequest(data, i)}>
        <Tag color={color}>{data.request.method?.toUpperCase()}</Tag> {urlParsed}
      </span>
      <span style={{ float: 'right' }}>
        <Popconfirm
          title="Are you sure to delete this request?"
          onConfirm={() => remove(col?.id, data.id)}>
          <DeleteOutlined />
        </Popconfirm>
      </span>
    </>
  }

  const sendRequest = async (req: any, i?: number) => {
    history.push('/app')
    await new Promise(res => setTimeout(res, 100))
    if (i) {
      setRoute(`/app/${i}`)
    }
    setRequestSent(req)
  }

  const onSend = () => {
    setHistories(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : [])
    setTimeout(() => {
      setCollections(window.localStorage.getItem('collections') ? JSON.parse(window.localStorage.getItem('collections')!).sort((a, b) => a.title.localeCompare(b.title)) : [])
    }, 500)
  }

  const addFolder = async () => {
    if (!formNewFolder.getFieldValue('title') || collections.find(col => col.title === formNewFolder.getFieldValue('title'))) {
      return message.error(`${formNewFolder.getFieldValue('title')} already exists`)
    }
    setCollections([...collections || [], {
      id: createId(),
      title: formNewFolder.getFieldValue('title'),
      isFolder: true
    }].sort((a, b) => a.title.localeCompare(b.title)))
    setIsAddFolder(false)
    formNewFolder.resetFields()
  }

  const remove = async (colId?: string, id?: string) => {
    if (!id) {
      return setCollections(collections.map(col => col.id === colId ? null : col).filter(Boolean))
    }
    if (!colId) {
      return setHistories(histories.map(req => req.id === id ? null : req).filter(Boolean))
    }
    return setCollections(collections.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          requests: col?.requests.map((req: any) => req.id === id ? null : req).filter(Boolean)
        }
      }
      return col
    }))
  }

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections.sort((a, b) => a.title.localeCompare(b.title))))
  }, [collections])

  useEffect(() => {
    localStorage.setItem('histories', JSON.stringify(histories))
  }, [histories])

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
        <Menu mode="inline" defaultSelectedKeys={[route]} selectedKeys={[route]} defaultOpenKeys={['/app/history', '/app/collections']} theme={currentTheme as any || 'dark'}>
          <Menu.Item key="/app" icon={<HomeOutlined />}>
            <Link to="/app" onClick={() => setRoute('/app')}>Main</Link>
          </Menu.Item>
          <Menu.Item key="/app/import" icon={<ImportOutlined />}>
            <Link to="/app/import" onClick={() => setRoute('/app/import')}>Import</Link>
          </Menu.Item>
          <Menu.Item key="/app/settings" icon={<SettingOutlined />}>
            <Link to="/app/settings" onClick={() => setRoute('/app/settings')}>Settings</Link>
          </Menu.Item>
          <Menu.SubMenu key="/app/collections" icon={<AppstoreAddOutlined />} title="Collections">
            <Menu.Item key={'/app/collections/add'} onClick={() => setIsAddFolder(true)}>
              <PlusOutlined /> Add Collection
            </Menu.Item>
            { collections?.length ? collections?.map((col: any, i: number) => (
              <Menu.SubMenu key={`app/collections/folder/${i}`} title={
                <span>
                  <span>{col.title}</span>
                  <span style={{ float: 'right' }}>
                    <Popconfirm
                      title="Are you sure to delete this collection?"
                      onConfirm={() => remove(col.id)}>
                      <DeleteOutlined />
                    </Popconfirm>
                  </span>
                </span>
              }>
                { col.requests?.length ? col.requests.map((req: any, i: number) => (
                  <Menu.Item key={`/app/${i}`}>
                    <TitleHistory data={req} col={col} i={i} />
                  </Menu.Item>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }
              </Menu.SubMenu>
            )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }
          </Menu.SubMenu>
          <Menu.SubMenu key="/app/history" icon={<HistoryOutlined />} title="History">
            { histories?.length ? histories?.map((req: any, i: number) => (
              <Menu.Item key={`/app/${i}`}>
                <TitleHistory data={req} col={undefined} i={i} />
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
            onSend={onSend}
            initialCollections={collections}
            goToSettings={() => setRoute('/app/settings')} /> : '' }
          { route === '/app/settings' ? <Settings /> : '' }
          { route === '/app/download' ? <Download /> : '' }
          { route === '/app/import' ? <Import onSendRequest={sendRequest} /> : '' }
        </Layout.Content>
      </Layout>
      <Modal title="Add Collection" visible={isAddFolder} onOk={addFolder} onCancel={() => setIsAddFolder(false)}>
        <Form form={formNewFolder} layout="vertical">
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title' }]}>
            <Input placeholder="My Collection" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

export default App

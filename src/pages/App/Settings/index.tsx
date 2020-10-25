import { SettingOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Layout, message, Switch } from 'antd'
import React, { useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'

const Settings: React.FC = () => {
  const { switcher, themes, currentTheme } = useThemeSwitcher()
  const [proxy, setProxy] = useState<string | undefined>(window.localStorage.getItem('proxy') || process.env.REACT_APP_PROXY || `${window.location.origin}/proxy`)

  const save = async () => {
    window.localStorage.setItem('proxy', proxy!)
    message.success('Saved!')
  }

  return (
    <>
      <Card title={<><SettingOutlined /> Settings</>}>
        <Form labelCol={{ lg: { span: 4 } }} wrapperCol={{ lg: { span: 13 } }} onFinish={save}>
          <Form.Item name="theme" label="Dark Mode">
            <Switch checked={currentTheme === 'dark'} onChange={() => switcher({ theme: currentTheme === 'dark' ? themes.light : themes.dark })} />
          </Form.Item>
          { !window.localStorage.getItem('download-token') ? (
            <>
              <Form.Item
                name="proxy"
                label="Proxy URL"
                initialValue={proxy}
                rules={[{ required: true, message: 'Proxy URL cannot be blank' }]}
                extra={<>Deploy your own proxy with: <a href="https://github.com/mgilangjanuar/restfire-proxy">github.com/mgilangjanuar/restfire-proxy</a></>}>
                <Input value={proxy} type="url" placeholder="Proxy" onChange={({ target }) => setProxy(target.value)} />
              </Form.Item>
              <Form.Item wrapperCol={{ lg: { offset: 4 } }}>
                <Button htmlType="submit" type="primary">Save</Button>
              </Form.Item>
            </>
          ) : '' }
        </Form>
      </Card>
      <Layout.Footer style={{ textAlign: 'center' }}>v0.0.1</Layout.Footer>
    </>
  )
}

export default Settings
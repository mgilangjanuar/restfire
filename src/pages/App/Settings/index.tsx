import { SettingOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Layout, Switch } from 'antd'
import React, { useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'

const Settings: React.FC = () => {
  const { switcher, themes, currentTheme } = useThemeSwitcher()
  const [proxy, setProxy] = useState<string | undefined>(window.localStorage.getItem('proxy') || process.env.REACT_APP_PROXY || undefined)

  return (
    <>
      <Card title={<><SettingOutlined /> Settings</>}>
        <Form labelCol={{ lg: { span: 3 } }} wrapperCol={{ lg: { span: 21 } }} onFinish={() => window.localStorage.setItem('proxy', proxy!)}>
          <Form.Item name="theme" label="Dark Mode">
            <Switch checked={currentTheme === 'dark'} onChange={() => switcher({ theme: currentTheme === 'dark' ? themes.light : themes.dark })} />
          </Form.Item>
          <Form.Item
            name="proxy"
            label="Proxy URL"
            rules={[{ required: true, message: 'Proxy URL cannot be blank' }]}
            extra={<>Deploy your own proxy with: <a href="https://github.com/mgilangjanuar/restfire-proxy">github.com/mgilangjanuar/restfire-proxy</a></>}>
            <Input defaultValue={proxy} type="url" placeholder="Proxy" onChange={({ target }) => setProxy(target.value)} />
          </Form.Item>
          <Form.Item wrapperCol={{ lg: { offset: 3 } }}>
            <Button htmlType="submit" type="primary">Save</Button>
          </Form.Item>
        </Form>
      </Card>
      <Layout.Footer style={{ textAlign: 'center' }}>v0.0.1</Layout.Footer>
    </>
  )
}

export default Settings
import { LinkOutlined, SettingOutlined, FireOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, message, Row, Switch } from 'antd'
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
      <br />
      <Card title={<><LinkOutlined /> Links</>}>
        <Row>
          <Col span={24} md={8}>
            <Card
              type="inner"
              title="Kitchen"
              actions={[<a href="https://www.notion.so/32c4c3d1b1c54fbba688a8eb424427e6?v=667a87fc3ae94636b5a724ca9c8683ef"><Button type="link">View our kitchen</Button></a>]}
              style={{ margin: '0 10px 20px' }}>
              This is our backlogs for <FireOutlined /> RestFire Studio. You can see our progress here.
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card
              type="inner"
              title="Issues"
              actions={[<a href="https://www.notion.so/ef78165be87a4f23adb60319a4029179?v=8f59d36731f14b07a168cb58e9b7ee35"><Button type="link">Check list of issue</Button></a>]}
              style={{ margin: '0 10px 20px' }}>
              In this link you'll see all a list of all the issues raised by other people.
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card
              type="inner"
              title="Feedback"
              actions={[<a href="https://mgilangjanuar.typeform.com/to/wOfIluzU"><Button type="link">Send feedback</Button></a>]}
              style={{ margin: '0 10px 20px' }}>
              With this link you can request the feature you want or bug you found. Please tell us <span role="img" aria-label="emoji">😉</span>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default Settings
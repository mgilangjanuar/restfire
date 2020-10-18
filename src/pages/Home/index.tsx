import { AntDesignOutlined, BulbOutlined, FireOutlined } from '@ant-design/icons'
import { Button, Carousel, Col, Layout, Row, Switch, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>()
  const { switcher, themes } = useThemeSwitcher()

  useEffect(() => {
    let theme = window.localStorage.getItem('theme')
    if (isDarkMode !== undefined) {
      theme = isDarkMode ? 'dark' : 'light'
    } else if (!theme) {
      theme = 'dark'
    }
    window.localStorage.setItem('theme', theme)
    setIsDarkMode(theme === 'dark')
    switcher({ theme: theme === 'dark' ? themes.dark : themes.light })
  }, [switcher, themes, isDarkMode])

  return (
    <Layout>
      <Layout.Header style={{ padding: 0, ...isDarkMode ? {} : { backgroundColor: '#fff' } }}>
        <Link to="/">
          <span style={{ fontSize: '1.2em', paddingLeft: '24px', color: isDarkMode ? '#fff' : '#000' }}><FireOutlined /> RestFire Studio</span>
        </Link>
        <Button style={{ float: 'right', top: '16px', right: '24px', display: 'inline' }} type="text" icon={<BulbOutlined />} shape="circle" onClick={() => setIsDarkMode(!isDarkMode)} />
      </Layout.Header>
      <Layout.Content style={{ minHeight: '90vh', padding: '10px' }}>
        <Row align="middle">
          <Col lg={16} style={{ textAlign: 'center', padding: '56px 12px 56px 12px' }}>
            <img alt="asset-1" src="/assets/Untitled 2.png" style={{ maxWidth: '850px', width: '100%' }} />
          </Col>
          <Col lg={8} style={{ textAlign: 'left', padding: '12px' }}>
            <Typography.Title>
              The Web-based Test and Design API Platform
            </Typography.Title>
            <Typography.Paragraph>
              This platform will help your API development easy to test <strong>without installing</strong> any software on your device.
              Pssttt, <strong>no need to register/login</strong> either.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Link to="/app"><Button size="large" type="primary">Get Started</Button></Link>
            </Typography.Paragraph>
          </Col>
        </Row>
        <Row align="middle" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '36px 12px 0' }}>
            <Typography.Title level={3}>
              Now in your hand
            </Typography.Title>
            <Typography.Paragraph>
              Open <strong><FireOutlined /> RestFire Studio</strong> anytime and anywhere.
            </Typography.Paragraph>
          </Col>
          <Col lg={12} style={{ textAlign: 'center', padding: '56px 12px 56px 12px' }}>
            <img alt="asset-1" src="/assets/smartmockups_kgewcl0o.png" style={{ maxWidth: '270px', width: '100%' }} />
          </Col>
        </Row>
        <Row align="middle">
          <Col lg={12} style={{ textAlign: 'right', padding: '36px 12px 0' }}>
            <Typography.Title level={3}>
              Designed for developers
            </Typography.Title>
            <Typography.Paragraph>
              We built <strong><FireOutlined /> RestFire Studio</strong> for developers to make it easier for you to keep track of your API. You can fully customize the request with your own configuration and show the response log in debug mode.
            </Typography.Paragraph>
          </Col>
          <Col lg={12} style={{ textAlign: 'center', padding: '56px 12px 56px 12px' }}>
            <Carousel autoplay dots={false} effect="scrollx">
              <div>
                <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 11.47.37.png" style={{ maxWidth: '650px', width: '100%' }} />
              </div>
              <div>
                <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 11.52.19.png" style={{ maxWidth: '650px', width: '100%' }} />
              </div>
            </Carousel>
          </Col>
        </Row>
        <Row align="middle" style={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }}>
          <Col lg={8} style={{ textAlign: 'right', padding: '36px 12px 0' }}>
            <Typography.Title level={3}>
              With two theme options
            </Typography.Title>
            <Typography.Paragraph>
              Dark &nbsp;<Switch checked={!isDarkMode} onChange={e => setIsDarkMode(!e)} />&nbsp; Light
            </Typography.Paragraph>
          </Col>
          <Col lg={16} style={{ textAlign: 'center', padding: '56px 12px 56px 12px' }}>
            { isDarkMode ? <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 09.57.10.png" style={{ maxWidth: '850px', width: '100%' }} /> : <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 10.02.18.png" style={{ maxWidth: '850px', width: '100%' }} /> }
          </Col>
        </Row>
        <Row align="middle">
          <Col lg={12} style={{ textAlign: 'center', padding: '56px 12px 56px 12px' }}>
            <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 11.56.07.png" style={{ maxWidth: '380px', width: '100%' }} />
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '36px 12px 0' }}>
            <Typography.Title level={3}>
              <em>"Those who don't know history are destined to repeat it"</em>
            </Typography.Title>
            <Typography.Paragraph>
              So, we save it in your local storage of browser to keep you safe and secure.
            </Typography.Paragraph>
          </Col>
        </Row>
      </Layout.Content>
      <br /><br />
      <Layout.Footer style={{ textAlign: 'center' }}>
        <FireOutlined /> RestFire Studio &copy; 2020 &mdash; React components by <a href="https://ant.design"><AntDesignOutlined /> Ant Design</a>
      </Layout.Footer>
    </Layout>
  )
}

export default Home
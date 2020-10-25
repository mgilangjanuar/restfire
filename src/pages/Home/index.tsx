import { FireOutlined } from '@ant-design/icons'
import { Button, Carousel, Col, Layout, Row, Switch, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const Home: React.FC = () => {
  const { switcher, themes, currentTheme } = useThemeSwitcher()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <Header defaultSelectedKey="home" />
      <Layout.Content style={{ minHeight: '90vh' }}>
        <Row align="middle" style={{ padding: '56px 15px' }}>
          <Col lg={14} style={{ textAlign: 'right', padding: '12px 36px 36px 12px' }}>
            <img alt="asset-1" src="/assets/Untitled 2.png" style={{ maxWidth: '850px', width: '100%' }} />
          </Col>
          <Col lg={10} style={{ textAlign: 'left', padding: '12px' }}>
            <Typography.Title>
              The Web-based Test and Design API Platform
            </Typography.Title>
            <Typography.Title level={4} type="secondary">
              A platform that will help your API development easy to test <strong>without installing</strong> any software on your device.
              Pssttt, <strong>no need to register/login</strong> either.
            </Typography.Title>
            <Typography.Title level={4}>
              <Link to="/app"><Button size="large" type="primary">Get Started</Button></Link>
            </Typography.Title>
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '56px 15px', backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#fff' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '36px 12px 0', width: '100%' }}>
            <Typography.Title level={1}>
              Now in your hand
            </Typography.Title>
            <Typography.Title level={4} type="secondary">
              Open <strong><FireOutlined /> RestFire Studio</strong> <u>anytime</u> and <u>anywhere</u>.
            </Typography.Title>
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '36px 12px 36px 36px', width: '100%' }}>
            <img alt="asset-1" src="/assets/smartmockups_kgewcl0o.png" style={{ maxWidth: '270px', width: '100%' }} />
          </Col>
        </Row>
        <Row style={{ padding: '56px 15px' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '36px 12px 0' }}>
            <Typography.Title level={1}>
              Designed for developers
            </Typography.Title>
            <Typography.Title level={4} type="secondary">
              We built <strong><FireOutlined /> RestFire Studio</strong> for developers to make it easier for you to keep track of your API. You can fully customize the request with your own configuration and show the response log in debug mode.
            </Typography.Title>
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '36px 12px 24px 36px' }}>
            <Carousel autoplay dots={false} effect="scrollx">
              <div>
                <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 11.50.23.png" style={{ maxWidth: '650px', width: '100%' }} />
              </div>
              <div>
                <img alt="asset-2" src="/assets/Screen Shot 2020-10-18 at 11.49.37.png" style={{ maxWidth: '650px', width: '100%' }} />
              </div>
              <div>
                <img alt="asset-3" src="/assets/Screen Shot 2020-10-18 at 11.52.19.png" style={{ maxWidth: '650px', width: '100%' }} />
              </div>
              <div>
                <img alt="asset-4" src="/assets/Screen Shot 2020-10-18 at 11.47.37.png" style={{ maxWidth: '650px', width: '100%' }} />
              </div>
            </Carousel>
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '56px 15px', backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#fff' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '24px 36px 36px 12px' }}>
            { currentTheme === 'dark' ? (
              <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 09.57.10.png" style={{ maxWidth: '850px', width: '100%' }} />
            ) : (
              <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 10.02.18.png" style={{ maxWidth: '850px', width: '100%' }} />
            ) }
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '36px 12px 12px' }}>
            <Typography.Title level={1}>
              With two theme options
            </Typography.Title>
            <Typography.Title level={4} type="secondary">
              <Switch checkedChildren="Light" unCheckedChildren="Dark" checked={currentTheme !== 'dark'} onChange={() => switcher({ theme: currentTheme === 'dark' ? themes.light : themes.dark })} />
            </Typography.Title>
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '56px 15px 56px' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '56px 36px 0 12px' }}>
            <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 11.56.07.png" style={{ maxWidth: '380px', width: '100%' }} />
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '36px 12px 12px' }}>
            <Typography.Title level={1}>
              <em>"Those who don't know history are destined to repeat it"</em>
            </Typography.Title>
            <Typography.Title level={4} type="secondary">
              So, we save it in your local storage of browser to keep you safe and secure.
            </Typography.Title>
          </Col>
        </Row>
        <Row align="middle" style={{ marginTop: '86px', marginBottom: '48px', padding: '15px' }}>
          <Col span={24} lg={{ span: 14, offset: 5 }} style={{ padding: '56px', textAlign: 'center', backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#fff' }}>
            <Typography.Title level={3}>
              Try for free &nbsp; &nbsp;
              <Link to="/app">
                <Button size="large" type="primary">Get Started</Button>
              </Link>
            </Typography.Title>
          </Col>
        </Row>
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Home
import { FireOutlined } from '@ant-design/icons'
import { Button, Carousel, Col, Layout, Row, Switch, Typography } from 'antd'
import React from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const Home: React.FC = () => {
  const { switcher, themes, currentTheme } = useThemeSwitcher()

  return (
    <Layout>
      <Header defaultSelectedKey="home" />
      <Layout.Content style={{ minHeight: '90vh', padding: '10px 0' }}>
        <Row align="middle" style={{ padding: '10px' }}>
          <Col lg={14} style={{ textAlign: 'right', padding: '12px 36px 36px 12px' }}>
            <img alt="asset-1" src="/assets/Untitled 2.png" style={{ maxWidth: '850px', width: '100%' }} />
          </Col>
          <Col lg={10} style={{ textAlign: 'left', padding: '12px' }}>
            <Typography.Title>
              The Web-based Test and Design API Platform
            </Typography.Title>
            <Typography.Paragraph>
              This platform will help your API development easy to test <strong>without installing</strong> any software on your device.
              Pssttt, <strong>no need to register/login</strong> either.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Link to="/pricing"><Button size="large" type="primary">Get Started</Button></Link>
            </Typography.Paragraph>
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '10px', backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#fff' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '36px 12px 0', width: '100%' }}>
            <Typography.Title level={3}>
              Now in your hand
            </Typography.Title>
            <Typography.Paragraph>
              Open <strong><FireOutlined /> RestFire Studio</strong> anytime and anywhere.
            </Typography.Paragraph>
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '56px 12px 56px 36px', width: '100%' }}>
            <img alt="asset-1" src="/assets/smartmockups_kgewcl0o.png" style={{ maxWidth: '270px', width: '100%' }} />
          </Col>
        </Row>
        <Row style={{ padding: '10px' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '56px 12px 0' }}>
            <Typography.Title level={3}>
              Designed for developers
            </Typography.Title>
            <Typography.Paragraph>
              We built <strong><FireOutlined /> RestFire Studio</strong> for developers to make it easier for you to keep track of your API. You can fully customize the request with your own configuration and show the response log in debug mode.
            </Typography.Paragraph>
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '56px 12px 56px 36px' }}>
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
        <Row align="middle" style={{ padding: '10px', backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : '#fff' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '24px 36px 0 12px' }}>
            { currentTheme === 'dark' ? (
              <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 09.57.10.png" style={{ maxWidth: '850px', width: '100%' }} />
            ) : (
              <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 10.02.18.png" style={{ maxWidth: '850px', width: '100%' }} />
            ) }
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '36px 12px 56px' }}>
            <Typography.Title level={3}>
              With two theme options
            </Typography.Title>
            <Typography.Paragraph>
              Dark &nbsp;<Switch checked={currentTheme !== 'dark'} onChange={() => switcher({ theme: currentTheme === 'dark' ? themes.light : themes.dark })} />&nbsp; Light
            </Typography.Paragraph>
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '10px' }}>
          <Col lg={12} style={{ textAlign: 'right', padding: '56px 36px 0 12px' }}>
            <img alt="asset-1" src="/assets/Screen Shot 2020-10-18 at 11.56.07.png" style={{ maxWidth: '380px', width: '100%' }} />
          </Col>
          <Col lg={12} style={{ textAlign: 'left', padding: '36px 12px 12px' }}>
            <Typography.Title level={3}>
              <em>"Those who don't know history are destined to repeat it"</em>
            </Typography.Title>
            <Typography.Paragraph>
              So, we save it in your local storage of browser to keep you safe and secure.
            </Typography.Paragraph>
          </Col>
        </Row>
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Home
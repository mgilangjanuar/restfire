import { Button, Card, Col, Layout, message, Row, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const Pricing: React.FC = () => {
  return (
    <Layout>
      <Header defaultSelectedKey="pricing" />
      <Layout.Content style={{ minHeight: '90vh', padding: '20px 24px' }}>
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '36px' }}>Pricing</Typography.Title>
        <Row>
          <Col span={24} lg={{ span: 6, offset: 6 }} style={{ padding: '0 10px 20px' }}>
            <Card
              title="Frreeee"
              cover={<img src="/assets/frog.png" alt="frog" />}
              actions={[<Link to="/app"><Button>Select &nbsp; <span role="img" aria-label="emoji">😋</span></Button></Link>]}>
              <ul>
                <li>Basic functionality</li>
                <li>Web-based only</li>
                <li>Using custom proxy</li>
                <li>Request history</li>
              </ul>
            </Card>
          </Col>
          <Col span={24} lg={{ span: 6, offset: 0 }} style={{ padding: '0 10px 20px' }}>
            <Card
              title="Premium"
              cover={<img src="/assets/wolf.png" alt="wolf" />}
              actions={[<Link to="#"><Button onClick={() => message.info('Sorry, this is not available yet :(')} type="primary">Select &nbsp; <span role="img" aria-label="emoji">🎉</span></Button></Link>]}>
              <ul>
                <li>All in <em>Frreeee</em></li>
                <li>Desktop installable</li>
                <li>Localhost API support</li>
                <li>Etc.</li>
              </ul>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: '36px' }}>
          <Col span={24} lg={{ span: 12, offset: 6 }}>
            <Card
              title={<em>"I want to help this development, but I've no idea what I should do"</em>}
              actions={[
                <a href="https://karyakarsa.com/mgilangjanuar/restfire-studio">
                  <Button type="link" size="large">Buy sunflower seeds now!</Button>
                </a>
              ]}>
              <Typography.Paragraph>
                Your're the person like this? Don't worry, you can help us to make it better and keep
                it up by buying us a bag of sunflower seeds for our hamsters. Ya! we have hamsters here,
                you can play with them anytime. They have 8 kids, now!
              </Typography.Paragraph>
              <Typography.Paragraph style={{ textAlign: 'center' }}>
                <span role="img" aria-label="emoji">🐹 🐹 🐹 🐹 🐹 🐹 🐹 🐹 🤣</span>
              </Typography.Paragraph>
            </Card>
          </Col>
        </Row>
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Pricing
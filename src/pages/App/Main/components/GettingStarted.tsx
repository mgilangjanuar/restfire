import { ArrowRightOutlined, RocketOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Card, Col, Result, Row, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { Link } from 'react-router-dom'
import useWindowSize from 'react-use/lib/useWindowSize'
import { generate as createId } from 'shortid'

interface Props {
  init: () => any,
  goToSettings: () => any
}

const GettingStarted: React.FC<Props> = ({ init, goToSettings }) => {
  const [name] = useState<string>(createId())
  const [runConfetti, setRunConfetti] = useState<boolean>(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (!window.localStorage.getItem('histories') && !window.localStorage.getItem('requestData')) {
      setRunConfetti(true)
      setTimeout(() => setRunConfetti(false), 5000)
    }
  }, [])

  return (
    <>
      { !window.localStorage.getItem('histories') && !window.localStorage.getItem('requestData') ? <Confetti
        width={width}
        height={height}
        recycle={runConfetti} /> : '' }
      <Card>
        <Row align="middle">
          <Col span={24} lg={16}>
            <Result
              icon={<img style={{ width: '100%', maxWidth: '420px' }} alt="welcome" src="/assets/welcome.png" />}
              title={<>Welcome, {name}!</>}
              subTitle={<small><a href="http://www.freepik.com">Designed by Freepik</a></small>}
            />
            <Typography.Paragraph>
              Since we decided to make it seamless and keep the anonymously, we'll call you <strong>{name}</strong>. Err... we know it sounds like Musk's baby, right? We hope you have no problem with that.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text type="warning"><WarningOutlined /></Typography.Text> Before you jump in, by default we'll use proxy to request the API to bypass the CORS
              or some errors like that. If you want to keep feel safe, go to the <Link to="/app/settings" onClick={goToSettings}>settings page</Link> and
              use your own proxy. <strong>Unless</strong> you're running it in an installable desktop app, keep calm and don't worry about that 😁
            </Typography.Paragraph>
            <br />
          </Col>
          <Col span={24} lg={8}>
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <Space direction="vertical">
                <Button size="large" onClick={init} type="primary" icon={<RocketOutlined />}>I Agree! <ArrowRightOutlined /></Button>
                <Link to="/">Maybe later <span role="img" aria-label="emoji">🤔</span></Link>
              </Space>
            </Typography.Paragraph>
          </Col>
        </Row>
        v0.0.3
      </Card>
    </>
  )
}

export default GettingStarted
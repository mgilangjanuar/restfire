import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Typography } from 'antd'
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
      <Card title={<em>Welcome, {name}!</em>}>
        <Row align="middle">
          <Col span={24} lg={16}>
            <Typography.Paragraph>
              Since we decide to make it seamless and no need to register/login, we'll call you {name}.
              Err... we know it sounds like Musk's baby, right? We hope you have no problem with that.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Before you jump in, by default we'll use proxy to request the API to prevent the CORS
              or some errors like that. We know, it should be mentioned in the terms or privacy policy
              page. But, our intern is still figure out how to create that fucking page with React.
              We've already told him to just build it with the plain HTML. But, he refused. We're
              considering firing him next month.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Go to the <Link to="/app/settings" onClick={goToSettings}>settings page</Link> and use your own proxy.
            </Typography.Paragraph>
            <br />
          </Col>
          <Col span={24} lg={8}>
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <Button onClick={init}>Get Started <ArrowRightOutlined /></Button>
            </Typography.Paragraph>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default GettingStarted
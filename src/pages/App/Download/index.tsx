import { AppleFilled, DownloadOutlined, QqOutlined, WindowsFilled } from '@ant-design/icons'
import { Button, Card, Typography } from 'antd'
import React from 'react'

const Download: React.FC = () => {

  return (
    <Card title={<><DownloadOutlined /> Desktop App (Live Preview)</>}>
      <Typography.Paragraph>
        <a href="https://lang-updater.herokuapp.com">
          <Button style={{ marginBottom: '10px', marginRight: '10px' }} icon={<AppleFilled />}>Mac OS</Button>
        </a>
        <Button style={{ marginBottom: '10px', marginRight: '10px' }} disabled icon={<WindowsFilled />}>Windows (comming soon)</Button>
        <Button style={{ marginBottom: '10px' }} disabled icon={<QqOutlined />}>Linux (comming soon)</Button>
      </Typography.Paragraph>
    </Card>
  )
}

export default Download
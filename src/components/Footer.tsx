import { FireOutlined } from '@ant-design/icons'
import { Divider, Layout, Space, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      <Divider />
      <Typography.Paragraph>
        <FireOutlined /> RestFire Studio &copy; 2020
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Space split={<>&middot;</>}>
          <Link to="/">Home</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </Space>
      </Typography.Paragraph>
    </Layout.Footer>
  )
}

export default Footer
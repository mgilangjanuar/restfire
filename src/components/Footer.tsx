import { FireOutlined } from '@ant-design/icons'
import { Divider, Layout, Space, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      <Divider />
      <Typography.Paragraph>
        <FireOutlined /> RestFire Studio &copy; 2021
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Space split={<>&middot;</>}>
          <Link to="/">Home</Link>
          {/* <Link to="/pricing">Pricing</Link> */}
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </Space>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <a href="https://vercel.com?utm_source=restfire-studio&utm_campaign=oss">
          <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" alt="Powered by Vercel" />
        </a>
      </Typography.Paragraph>
    </Layout.Footer>
  )
}

export default Footer
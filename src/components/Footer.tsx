import { AntDesignOutlined, FireOutlined } from '@ant-design/icons'
import { Divider, Layout, Space, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <>
      <Divider />
      <Layout.Footer style={{ textAlign: 'center' }}>
        <Typography.Paragraph>
          <FireOutlined /> RestFire Studio &copy; 2020 &mdash; React components by <a href="https://ant.design"><AntDesignOutlined /> Ant Design</a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Space split={<>&middot;</>}>
            <Link to="/about">About</Link>
            <Link to="/terms">Terms and Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </Space>
        </Typography.Paragraph>
      </Layout.Footer>
    </>
  )
}

export default Footer
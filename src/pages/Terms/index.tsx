import { LoadingOutlined } from '@ant-design/icons'
import { Layout, Result } from 'antd'
import React from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const Terms: React.FC = () => {
  return (
    <Layout>
      <Header />
      <Layout.Content style={{ minHeight: '90vh', padding: '10px 0' }}>
        <Result icon={<LoadingOutlined />} />
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Terms
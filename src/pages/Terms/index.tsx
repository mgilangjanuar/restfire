import { Layout } from 'antd'
import React from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Maintenance from '../../components/Maintenance'

const Terms: React.FC = () => {
  return (
    <Layout>
      <Header defaultSelectedKey="terms" />
      <Layout.Content style={{ minHeight: '90vh', padding: '20px 24px' }}>
        <Maintenance />
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Terms
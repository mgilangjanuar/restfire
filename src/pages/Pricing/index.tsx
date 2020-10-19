import { Layout } from 'antd'
import React from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Maintenance from '../../components/Maintenance'

const Pricing: React.FC = () => {
  return (
    <Layout>
      <Header defaultSelectedKey="pricing" />
      <Layout.Content style={{ minHeight: '90vh', padding: '20px 24px' }}>
        <Maintenance />
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Pricing
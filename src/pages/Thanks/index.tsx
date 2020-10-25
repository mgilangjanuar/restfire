import { Button, Layout, Result } from 'antd'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const Thanks: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <Header defaultSelectedKey="thanks" />
      <Layout.Content style={{ minHeight: '90vh', padding: '20px 10px' }}>
        <Result
          title="Thaaaaaaaaaaaaaanks"
          subTitle={<>We love you sooo much, much and much! So, here's a cat from <a href="https://cataas.com/">Cat as a service</a>.</>}
          icon={<img src="https://cataas.com/cat/gif" style={{ maxWidth: '720px', width: '100%' }} alt="cat" />}
          extra={<Link to="/app"><Button type="primary">Back to App</Button></Link>} />
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Thanks
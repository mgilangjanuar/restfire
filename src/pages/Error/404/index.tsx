import { Button, Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you requested for is doesn't exist."
      style={{ minHeight: '100vh' }}
      extra={<Link to="/"><Button type="primary">Home</Button></Link>} />
  )
}

export default NotFoundPage
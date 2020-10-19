import { Button, Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  extra?: any
}

const Maintenance: React.FC<Props> = ({ extra }) => {
  return (
    <Result
      icon={<img src="/assets/Untitled.png" alt="maintenance" style={{ maxWidth: '820px', width: '100%' }} />}
      title="Maintenance"
      subTitle={<>This page in working in progress. Thanks to <a href="https://www.freepik.com/free-vector/set-people-using-modern-technologies_5890117.htm#page=1&query=software&position=20">freepik.com</a> for the design 🙏</>}
      extra={extra || <Link to="/"><Button type="primary">Home</Button></Link>} />
  )
}

export default Maintenance
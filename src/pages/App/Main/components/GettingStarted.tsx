import { Button } from 'antd'
import React from 'react'
import Maintenance from '../../../../components/Maintenance'

interface Props {
  init: () => any
}

const GettingStarted: React.FC<Props> = ({ init }) => {
  return <Maintenance extra={<Button onClick={init} type="primary">Try it, anyway!</Button>} />
}

export default GettingStarted
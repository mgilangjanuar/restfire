import { CoffeeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, InputNumber, Row, Slider, Spin } from 'antd'
import Axios from 'axios'
import React, { useState } from 'react'
import { generate as createId } from 'shortid'

const Donate: React.FC = () => {
  const [amount, setAmount] = useState<number>(10)
  const [spin, setSpin] = useState<boolean>(false)

  const donate = async () =>{
    setSpin(true)
    const { data } = await Axios.post(window.localStorage.getItem('proxy') || process.env.REACT_APP_PROXY || '/proxy', {
      url: 'https://app.midtrans.com/snap/v1/transactions',
      method: 'post',
      data: JSON.stringify({
        transaction_details: {
          order_id: createId(),
          gross_amount: amount * 1e3
        }
      }),
      headers: {
        authorization: 'Basic TWlkLXNlcnZlci1GOGNOSVJCR2JaSGx1WE5jQnlSMHpxTXM6',
        'content-type': 'application/json'
      }
    })
    setSpin(false)
    return window.location.href = data.data.redirect_url
  }

  return (
    <Card title={<><CoffeeOutlined /> Donate</>}>
      <Spin spinning={spin}>
        <Form onFinish={donate} >
          <Form.Item
            name="amount">
            <Row>
              <Col span={24} lg={4}>
                <InputNumber min={10} value={amount} onChange={amount => setAmount(Number(amount))} /> IDR
              </Col>
              <Col span={24} lg={20}>
                <Slider defaultValue={10} value={amount} min={10} max={999} marks={{ 10: '10k', 999: '999k' }} onChange={(amount: number) => setAmount(amount)} />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button htmlType="submit" type="primary">Donate</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  )
}

export default Donate
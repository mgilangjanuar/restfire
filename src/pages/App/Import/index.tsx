import { ImportOutlined } from '@ant-design/icons'
import { generate as createId } from 'shortid'
import { Button, Card, Form, Input, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import parseCurl from 'parse-curl'
import React from 'react'

interface Props {
  onSendRequest: (req: any) => void
}

const Import: React.FC<Props> = ({ onSendRequest }) => {
  const [form] = useForm()

  const save = async () => {
    try {
      const raw = parseCurl(form.getFieldValue('curl'))
      console.log(raw)
      let method = raw.method?.toLowerCase() || 'get'
      if (method === 'options') {
        method = 'opt'
      } else if (method === 'delete') {
        method = 'del'
      }
      const id = createId()
      const params = raw.url.indexOf('?') >= 0 ? Object.fromEntries(new URLSearchParams(raw.url.substr(raw.url.indexOf('?')))) : []
      onSendRequest({
        id,
        request: {
          method,
          url: raw.url,
          contentType: raw.header?.['Content-Type'] || raw.header?.['content-type'],
          headers: raw.header ? Object.keys(raw.header)?.reduce((res, key) => [...res, { key, value: raw.header[key] }] as any, []) : [],
          body: raw.body,
          params: Object.keys(params)?.reduce((res, key) => [...res, { key, value: params[key] }] as any, [])
        }
      })
      return message.success('Imported successfully!')
    } catch (error) {
      return message.error('Something error, maybe the format is invalid')
    }
  }

  return (
    <>
      <Card title={<><ImportOutlined /> Import a single API</>}>
        <Form form={form} labelCol={{ lg: { span: 4 } }} wrapperCol={{ lg: { span: 18 } }} onFinish={save}>
          <Form.Item
            name="curl"
            label="cURL"
            rules={[{ required: true, message: 'cURL cannot be blank' }]}>
            <Input.TextArea rows={8} placeholder="Paste the cURL command here..." />
          </Form.Item>
          <Form.Item wrapperCol={{ lg: { offset: 4 } }}>
            <Button htmlType="submit" type="primary">Import</Button>
          </Form.Item>
        </Form>
      </Card>
      <br />
      <Card title={<><ImportOutlined /> Import a collection</>}>
        Work in progress
      </Card>
    </>
  )
}

export default Import
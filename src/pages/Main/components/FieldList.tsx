import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space } from 'antd'
import React from 'react'

interface Props {
  name: string,
  tab: {
    id: string
  },
  updateTab: (request: any, response?: any) => any,
  activeRequest?: {
    request: any
  }
}

const FieldList: React.FC<Props> = ({ name, tab, activeRequest, updateTab }) => {

  const updateListField = async (i: number, key: 'key' | 'value', { target }) => {
    const { value } = target
    const data = activeRequest?.request[name] || []
    data[i] = { ...data[i], [key]: value || null }
    return updateTab({ [name]: data })
  }

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map((field, i) => {
              return (
                <Space key={i} style={{ display: 'flex' }} align="baseline">
                  <Form.Item style={{ width: '35vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_key`]} fieldKey={[field.fieldKey, `${tab.id}_key`]}>
                    <Input placeholder="Key" autoComplete="off" onChange={e => updateListField(i, 'key', e)} />
                  </Form.Item>
                  <Form.Item
                    style={{ width: '35vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_value`]} fieldKey={[field.fieldKey, `${tab.id}_value`]}>
                    <Input placeholder="Value" autoComplete="off" onChange={e => updateListField(i, 'value', e)} />
                  </Form.Item>
                  <DeleteOutlined onClick={() => {
                    updateTab({ [name]: [...activeRequest?.request[name] || []].filter((_, j) => j !== i) })
                    return remove(field.name)
                  }} />
                </Space>
              )
            })}
            <Form.Item>
              <Button onClick={() => add()} type="default"><PlusOutlined /> Add {name}</Button>
            </Form.Item>
          </>
        )
      }}
    </Form.List>
  )
}

export default FieldList
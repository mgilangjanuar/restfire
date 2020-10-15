import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Upload } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React from 'react'

interface Props {
  name: string,
  form: FormInstance,
  tab: {
    id: string
  },
  updateTab: (request: any, response?: any) => any,
  activeRequest?: {
    request: any
  },
  buttonAddText?: string,
  useTypeField?: boolean
}

const FieldList: React.FC<Props> = ({ name, form, tab, activeRequest, updateTab, buttonAddText, useTypeField }) => {

  const updateListField = async (i: number, key: 'key' | 'value' | 'type', { target }) => {
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
                  { useTypeField ? (
                    <Form.Item style={{ width: '93px', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_type`]} fieldKey={[field.fieldKey, `${tab.id}_type`]}>
                      <Select onChange={e => updateListField(i, 'type', { target: { value: e } })} bordered={false}>
                        <Select.Option value="string">string</Select.Option>
                        <Select.Option value="file">file</Select.Option>
                      </Select>
                    </Form.Item>
                  ) : '' }
                  <Form.Item style={{ width: useTypeField ? '25vw' : '32vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_key`]} fieldKey={[field.fieldKey, `${tab.id}_key`]}>
                    <Input placeholder="Key" autoComplete="off" onChange={e => updateListField(i, 'key', e)} />
                  </Form.Item>
                  { form.getFieldValue([name, i, `${tab.id}_type`]) === 'file' ? (
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  ) : (
                    <Form.Item
                      style={{ width: useTypeField ? '25vw' : '32vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_value`]} fieldKey={[field.fieldKey, `${tab.id}_value`]}>
                      <Input placeholder="Value" autoComplete="off" onChange={e => updateListField(i, 'value', e)} />
                    </Form.Item>
                  ) }
                  <DeleteOutlined onClick={() => {
                    updateTab({ [name]: [...activeRequest?.request[name] || []].filter((_, j) => j !== i) })
                    return remove(field.name)
                  }} />
                </Space>
              )
            })}
            <Form.Item>
              <Button onClick={() => add(useTypeField ? { [`${tab.id}_type`]: 'string' } : undefined)} type="default"><PlusOutlined /> {buttonAddText || `Add ${name}`}</Button>
            </Form.Item>
          </>
        )
      }}
    </Form.List>
  )
}

export default FieldList
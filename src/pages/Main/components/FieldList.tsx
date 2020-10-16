import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Typography, Upload } from 'antd'
import { FormInstance } from 'antd/lib/form'
import filesize from 'filesize'
import React from 'react'

import './FieldList.css'

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

  const updateListField = async (i: number, key: 'key' | 'value' | 'type' | 'file', { target }) => {
    const { value } = target
    const data = activeRequest?.request[name] || []
    data[i] = { ...data[i], [key]: value || null }
    return updateTab({ [name]: data })
  }

  const getFile = (i: number, file: any): boolean => {
    updateListField(i, 'file', { target: { value: file } })
    return false
  }

  const insert = async(add: () => void, i: number) => {
    add()
    updateListField(i, 'key', { target: { value: null } })
    if (useTypeField) {
      updateListField(i, 'type', { target: { value: 'string' } })
    }
  }

  const getFileName = (i: number): string | null => {
    const file = activeRequest?.request[name]?.[i]?.file
    if (!file) {
      return null
    }
    return `${file?.name.substr(0, 5)}${file?.name.length > 5 ? '...' : ''} ${filesize(file?.size)}`
  }

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, i) => (
            <Space key={i} className="space" align="baseline">
              { useTypeField ? (
                <Form.Item style={{ width: '79px' }} { ...field } name={[field.name, `${tab.id}_type`]} fieldKey={[field.fieldKey, `${tab.id}_type`]}>
                  <Select onChange={e => updateListField(i, 'type', { target: { value: e } })} bordered={false}>
                    <Select.Option value="string">string</Select.Option>
                    <Select.Option value="file">file</Select.Option>
                  </Select>
                </Form.Item>
              ) : '' }
              <Form.Item { ...field } name={[field.name, `${tab.id}_key`]} fieldKey={[field.fieldKey, `${tab.id}_key`]}>
                <Input placeholder="Key" autoComplete="off" onChange={e => updateListField(i, 'key', e)} />
              </Form.Item>
              { form.getFieldValue([name, i, `${tab.id}_type`]) === 'file' ? (
                <Form.Item { ...field } name={[field.name, `${tab.id}_file`]} fieldKey={[field.fieldKey, `${tab.id}_file`]} valuePropName="files">
                  <Upload beforeUpload={file => getFile(i, file)} showUploadList={false}>
                    <Button icon={getFileName(i) ? undefined : <UploadOutlined />}>{getFileName(i) || 'Upload'}</Button>
                  </Upload>
                </Form.Item>
              ) : (
                <Form.Item { ...field } name={[field.name, `${tab.id}_value`]} fieldKey={[field.fieldKey, `${tab.id}_value`]}>
                  <Input placeholder="Value" autoComplete="off" onChange={e => updateListField(i, 'value', e)} />
                </Form.Item>
              ) }
              <Typography.Text type="danger">
                <DeleteOutlined onClick={() => {
                  updateTab({ [name]: [...activeRequest?.request[name] || []].filter((_, j) => j !== i) })
                  return remove(field.name)
                }} />
              </Typography.Text>
            </Space>
          ))}
          <Form.Item>
            <Button onClick={() => insert(add, fields.length)} type="default">
              <PlusOutlined /> {buttonAddText || `Add ${name}`}
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}

export default FieldList
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, message, Select, Space, Spin, Tabs, Tag, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Axios, { AxiosRequestConfig } from 'axios'
import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import AceEditor from 'react-ace'
import { generate as createId } from 'shortid'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/theme-vibrant_ink'

type Response = {
  status: number,
  body: any,
  headers: any
}

type Request = {
  method: string,
  url?: string,
  headers?: any,
  body?: any,
  params?: any[]
}

type RequestData = {
  id: string,
  title: any,
  request: Request,
  response?: Response
}

const Main: React.FC = () => {
  const [form] = useForm()
  const [requestData, setRequestData] = useState<RequestData[]>()
  const [activeRequest, setActiveRequest] = useState<RequestData>()
  const [activeTab, setActiveTab] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const buildInitialRequestData = (): RequestData => ({
    id: createId(),
    title: () => <>Untitled</>,
    request: {
      method: 'get'
    }
  })

  useEffect(() => {
    if (!requestData?.length) {
      const initial = buildInitialRequestData()
      setRequestData([initial])
      setActiveTab(initial.id)
    }
  }, [requestData])

  useEffect(() => {
    const present = [...requestData || []]?.find(req => req.id === activeTab)
    setActiveRequest(present)
    form.setFieldsValue({
      params: present?.request.params?.map(param => ({ [`${present.id}_key`]: param.key, [`${present.id}_value`]: param.value })) || [],
      headers: present?.request.headers?.map(header => ({ [`${present.id}_key`]: header.key, [`${present.id}_value`]: header.value })) || []
    })
  }, [activeTab, requestData, form])

  const mutateTabs = (key: any, action: string) => {
    if (action === 'add') {
      setRequestData([...requestData || [], buildInitialRequestData()])
    } else if (action === 'remove') {
      setRequestData(requestData?.filter(req => req.id !== key))
      if (activeTab === key) {
        setActiveTab(requestData?.[0].id)
      }
    }
  }

  const updateTab = async (data: Partial<Request>, resp?: Partial<Response>) => {
    let color: string | undefined = undefined
    if ((data?.method || activeRequest?.request.method) === 'post') {
      color = 'green'
    } else if ((data?.method || activeRequest?.request.method) === 'patch') {
      color = 'orange'
    } else if ((data?.method || activeRequest?.request.method) === 'put') {
      color = 'cyan'
    } else if ((data?.method || activeRequest?.request.method) === 'del') {
      color = 'red'
    } else if ((data?.method || activeRequest?.request.method) === 'opt') {
      color = 'lime'
    }

    const urlParsed = (data.url || activeRequest?.request.url)?.replace(/^http[s]*:\/\//gi, '')
    const title = () => <>
      <Tag color={color}>{(data?.method || activeRequest?.request.method)?.toUpperCase()}</Tag> {urlParsed ? urlParsed?.substr(0, 12) + (urlParsed?.length > 12 ? '...' : '') : 'Untitled'}
    </>

    if (activeRequest && requestData) {
      const idx = requestData?.indexOf(requestData!.find(req => req.id === activeRequest.id)!)
      const requests = [...requestData]
      requests[idx] = {
        ...requests[idx],
        title,
        request: {
          ...requests[idx].request,
          ...data
        },
        response: {
          ...requests[idx].response || {},
          ...resp || {}
        } as Response
      }
      setRequestData(requests)
    }
  }

  const findMode = (): string => {
    const candidate = activeRequest?.response?.headers?.['content-type']?.split(';')[0].split('/')?.[1]
    if (!candidate || candidate === 'plain') {
      return 'plain_text'
    }
    return candidate
  }

  const updateListField = async (i: number, data: 'params' | 'headers', key: 'key' | 'value', { target }) => {
    const { value } = target
    const params = activeRequest?.request[data] || []
    params[i] = { ...params[i], [key]: value || null }
    return updateTab({ [data]: params })
  }

  const send = async () => {
    const params = activeRequest?.request.params?.reduce((res: any, param: any) => ({ ...res, [param.key]: param.value }), {})
    const headers = activeRequest?.request.headers?.reduce((res: any, header: any) => ({ ...res, [header.key]: header.value }), {})
    if (!activeRequest?.request.url) {
      return message.error('Please fill the URL first')
    }
    setIsLoading(true)
    let method = activeRequest.request.method
    if (method === 'del') {
      method = 'delete'
    } else if (method === 'opt') {
      method = 'options'
    }

    try {
      const options: AxiosRequestConfig = {
        params: params || {},
        headers: headers || {},
      }
      const getResponse = await Axios[method](activeRequest.request.url, method === 'get' ? options : JSON.parse(activeRequest.request.body) || {}, options)
      updateTab({}, {
        status: getResponse.status,
        body: getResponse.data,
        headers: getResponse.headers
      })
    } catch (error) {
      console.log(error)
      if (error?.response) {
        updateTab({}, {
          status: error?.response?.status,
          body: error?.response?.data,
          headers: error?.response?.headers
        })
      } else {
        message.error('Something error')
      }
    }
    setIsLoading(false)
  }

  const SelectMethod = () => (
    <Select
      defaultValue={activeRequest?.request?.method || 'get'}
      value={activeRequest?.request.method}
      onChange={e => updateTab({ method: e })}
      style={{ minWidth: '90px' }}
    >
      <Select.Option value="get">GET</Select.Option>
      <Select.Option value="post">POST</Select.Option>
      <Select.Option value="patch">PATCH</Select.Option>
      <Select.Option value="put">PUT</Select.Option>
      <Select.Option value="del">DELETE</Select.Option>
      <Select.Option value="opt">OPTIONS</Select.Option>
    </Select>
  )

  return (
    <Tabs defaultActiveKey={activeTab?.toString() || requestData?.[0].id} activeKey={activeTab} type="editable-card" onEdit={mutateTabs} onChange={setActiveTab} size="small">
      { requestData?.map(tab => (
        <Tabs.TabPane tab={<tab.title />} key={tab.id}>
          <Form form={form} onFinish={send}>
            <Form.Item name="url">
              <span>
                <Input.Search
                  placeholder="Enter URL"
                  addonBefore={<SelectMethod />}
                  enterButton="Send"
                  value={tab?.request?.url}
                  required
                  onSearch={send}
                  onChange={e => updateTab({ url: e.target.value || '' })} />
              </span>
            </Form.Item>
            <Tabs defaultActiveKey="0">
              <Tabs.TabPane tab="Params" key="0">
                { activeRequest?.request.params?.length && activeRequest?.request?.url ? (
                  <Typography.Paragraph type="secondary">URL generated:&nbsp;
                    <em>
                      {queryString.stringifyUrl({ url: activeRequest?.request?.url, query: activeRequest?.request.params?.reduce((res: any, param: any) => ({ ...res, [param.key]: param.value }), {}) || {} })}
                    </em>
                  </Typography.Paragraph>
                ) : '' }
                <Form.List name="params">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map((field, i) => {
                          return (
                            <Space key={i} style={{ display: 'flex' }} align="baseline">
                              <Form.Item style={{ width: '35vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_key`]} fieldKey={[field.fieldKey, `${tab.id}_key`]}>
                                <Input placeholder="Key" autoComplete="off" onChange={e => updateListField(i, 'params', 'key', e)} />
                              </Form.Item>
                              <Form.Item
                                style={{ width: '35vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_value`]} fieldKey={[field.fieldKey, `${tab.id}_value`]}>
                                <Input placeholder="Value" autoComplete="off" onChange={e => updateListField(i, 'params', 'value', e)} />
                              </Form.Item>
                              <DeleteOutlined onClick={() => {
                                updateTab({ params: [...activeRequest?.request.params || []].filter((_, j) => j !== i) })
                                return remove(field.name)
                              }} />
                            </Space>
                          )
                        })}
                        <Form.Item>
                          <Button onClick={() => add()} type="default"><PlusOutlined /> Add param</Button>
                        </Form.Item>
                      </>
                    )
                  }}
                </Form.List>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Headers" key="1">
                <Form.List name="headers">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map((field, i) => {
                          return (
                            <Space key={i} style={{ display: 'flex' }} align="baseline">
                              <Form.Item style={{ width: '35vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_key`]} fieldKey={[field.fieldKey, `${tab.id}_key`]}>
                                <Input placeholder="Key" autoComplete="off" onChange={e => updateListField(i, 'headers', 'key', e)} />
                              </Form.Item>
                              <Form.Item
                                style={{ width: '35vw', marginBottom: '12px' }} { ...field } name={[field.name, `${tab.id}_value`]} fieldKey={[field.fieldKey, `${tab.id}_value`]}>
                                <Input placeholder="Value" autoComplete="off" onChange={e => updateListField(i, 'headers', 'value', e)} />
                              </Form.Item>
                              <DeleteOutlined onClick={() => {
                                updateTab({ headers: [...activeRequest?.request.headers || []].filter((_, j) => j !== i) })
                                return remove(field.name)
                              }} />
                            </Space>
                          )
                        })}
                        <Form.Item>
                          <Button onClick={() => add()} type="default"><PlusOutlined /> Add header</Button>
                        </Form.Item>
                      </>
                    )
                  }}
                </Form.List>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Body" key="2">
                <AceEditor
                  mode="json"
                  theme="vibrant_ink"
                  className="aceEditor"
                  name="editor1"
                  fontSize={12}
                  width="100%"
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  onChange={body => updateTab({ body })}
                  setOptions={{
                    maxLines: 15,
                    minLines: 10,
                    wrap: true,
                    tabSize: 2,
                    showPrintMargin: false,
                    useWorker: false
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
          </Form>
          <Divider />
          <Spin spinning={isLoading}>
              <Typography.Title level={5} type="secondary">Response <Typography.Text>{activeRequest?.response?.status}</Typography.Text></Typography.Title>
            <Tabs>
              <Tabs.TabPane tab="Body">
                <AceEditor
                  mode={findMode()}
                  theme="vibrant_ink"
                  className="aceEditor"
                  name="editor2"
                  fontSize={12}
                  width="100%"
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={typeof activeRequest?.response?.body === 'object' ? JSON.stringify(activeRequest?.response?.body, null, 2) : activeRequest?.response?.body || ''}
                  setOptions={{
                    maxLines: Infinity,
                    minLines: 20,
                    tabSize: 2,
                    showPrintMargin: false,
                    readOnly: true,
                    wrap: true,
                    useWorker: false
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
          </Spin>
        </Tabs.TabPane>
      )) }
    </Tabs>
  )
}

export default Main
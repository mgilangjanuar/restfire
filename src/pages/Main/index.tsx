import { Divider, Form, Input, message, Select, Spin, Tabs, Tag, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import { generate as createId } from 'shortid'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

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
  params?: any
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

  const buildInitialRequestData = () => ({
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
    setActiveRequest(requestData?.find(req => req.id === activeTab))
  }, [activeTab, requestData])

  const mutateTabs = (key: any, action: string) => {
    console.log(key, action)
    if (action === 'add') {
      setRequestData([...requestData || [], buildInitialRequestData()])
    } else if (action === 'remove') {
      setRequestData(requestData?.filter(req => req.id !== key))
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

  const send = async () => {
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
      const getResponse = await Axios[method](activeRequest.request.url, method === 'get' ? {} : JSON.parse(activeRequest.request.body))
      updateTab({}, {
        status: getResponse.status,
        body: getResponse.data,
        headers: getResponse.headers
      })
    } catch (error) {
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
    <Tabs defaultActiveKey={activeTab?.toString() || '0'} activeKey={activeTab} type="editable-card" onEdit={mutateTabs} onChange={setActiveTab} size="small">
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
                  onChange={e => updateTab({ url: e.target.value })} />
              </span>
            </Form.Item>
            <Tabs defaultActiveKey="0">
              <Tabs.TabPane tab="Params" key="0">
              </Tabs.TabPane>
              <Tabs.TabPane tab="Headers" key="1">
              </Tabs.TabPane>
              <Tabs.TabPane tab="Body" key="2">
                <AceEditor
                  mode="json"
                  theme="tomorrow_night"
                  className="aceEditor"
                  name="editor1"
                  fontSize={12}
                  width="100%"
                  height="250px"
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  onChange={body => updateTab({ body })}
                  setOptions={{
                    showLineNumbers: false,
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
            <Typography.Title level={5} type="secondary">Response</Typography.Title>
            <Tabs>
              <Tabs.TabPane tab="Body">
                <AceEditor
                  mode={findMode()}
                  theme="tomorrow_night"
                  className="aceEditor"
                  name="editor2"
                  fontSize={12}
                  width="100%"
                  height="250px"
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={typeof activeRequest?.response?.body === 'object' ? JSON.stringify(activeRequest?.response?.body, null, 2) : activeRequest?.response?.body || ''}
                  setOptions={{
                    showLineNumbers: false,
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
import { Divider, Form, Input, message, Select, Spin, Tabs, Tag, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Axios, { AxiosRequestConfig } from 'axios'
import FormData from 'form-data'
import qs from 'qs'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'
import { generate as createId } from 'shortid'
import Editor from './components/Editor'
import FieldList from './components/FieldList'

type Response = {
  status: number,
  body: any,
  responseTime?: number,
  headers: any
}

type Request = {
  method: string,
  contentType?: string,
  url?: string,
  headers?: any,
  body?: any,
  forms?: any[],
  formsEncoded?: any[],
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
    request: { method: 'get' }
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
      params: present?.request.params?.map(param => ({
        [`${present.id}_key`]: param.key || null,
        [`${present.id}_value`]: param.value || null })) || [],
      headers: present?.request.headers?.map((header: any) => ({
        [`${present.id}_key`]: header.key || null,
        [`${present.id}_value`]: header.value || null })) || [],
      forms: present?.request.forms?.map((form: any) => ({
        [`${present.id}_type`]: form.type || 'string',
        [`${present.id}_key`]: form.key || null,
        [`${present.id}_value`]: form.value || null,
        [`${present.id}_file`]: form.file || null })) || [],
      formsEncoded: present?.request.formsEncoded?.map((form: any) => ({
        [`${present.id}_key`]: form.key || null,
        [`${present.id}_value`]: form.value || null })) || [],
    })
  }, [activeTab, requestData, form])

  const mutateTabs = (key: any, action: string) => {
    if (action === 'add') {
      const initial = buildInitialRequestData()
      setRequestData([...requestData || [], initial])
      setActiveTab(initial.id)
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
          ...data,
          url: queryString.stringifyUrl({
            url: data.url !== undefined ? data.url : requests[idx]?.request?.url || '',
            query: requests[idx]?.request.params?.reduce((res: any, param: any) => ({ ...res, [param.key]: param.value }), {}) || {}
          })
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
      let data: any = null
      if (activeRequest.request.contentType === 'application/json' && activeRequest.request.body) {
        data =  activeRequest.request.body
      } else if (activeRequest.request.contentType === 'application/x-www-form-urlencoded' && activeRequest.request.formsEncoded) {
        data = qs.stringify(activeRequest?.request.formsEncoded?.reduce((res: any, field: any) => ({ ...res, [field.key]: field.value }), {}))
      } else if (activeRequest.request.contentType === 'multipart/form-data' && activeRequest.request.forms) {
        data = new FormData()
        for (const field of activeRequest.request.forms) {
          data.append(field.key, field.type === 'string' ? field.value : field.file)
        }
      }

      const options: AxiosRequestConfig = {
        method: method as any,
        url: activeRequest.request.url,
        params: params || {},
        headers: {
          ...headers,
          ...activeRequest?.request.contentType && activeRequest.request.contentType !== 'none' ? {
            contentType: activeRequest.request.contentType
          } : {}
        } || {},
        data,
      }

      Axios.interceptors.request.use(config => {
        (config as any).metadata = { startTime: new Date() }
        return config
      }, error => Promise.reject(error))

      Axios.interceptors.response.use(response => {
        (response.config as any).metadata.endTime = new Date()
        response = {
          ...response,
          duration: (response.config as any).metadata.endTime - (response.config as any).metadata.startTime
        } as any
        return response
      }, error => {
        error.config.metadata.endTime = new Date()
        error.duration = error.config.metadata.endTime - error.config.metadata.startTime
        return Promise.reject(error)
      })

      const getResponse = await Axios(options)

      updateTab({}, {
        status: getResponse.status,
        body: getResponse.data,
        headers: getResponse.headers,
        responseTime: (getResponse as any).duration
      })
    } catch (error) {
      console.error(error)
      if (error?.response) {
        updateTab({}, {
          status: error?.response?.status,
          body: error?.response?.data || JSON.stringify(error),
          headers: error?.response?.headers,
          responseTime: (error as any).duration
        })
      } else {
        updateTab({}, {
          headers: { 'content-type': 'application/json' },
          body: typeof error === 'object' ? JSON.stringify(error, null, 2) : error.toString()
        })
        message.error('Something error')
      }
    }
    setIsLoading(false)
  }

  const SelectMethod = () => (
    <Select
      defaultValue={activeRequest?.request?.method || 'get'}
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
                <FieldList name="params" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add param" />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Headers" key="1">
                <FieldList name="headers" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add header" />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Body" key="2">
                <Form.Item label="Content Type" wrapperCol={{ lg: { span: 6 }, md: { span: 12 } }}>
                  <Select style={{ minWidth: '240px' }} defaultValue={activeRequest?.request.contentType || 'none'} onChange={e => updateTab({ contentType: e })}>
                    <Select.Option value="none">none</Select.Option>
                    <Select.Option value="multipart/form-data">multipart/form-data</Select.Option>
                    <Select.Option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</Select.Option>
                    <Select.Option value="application/json">application/json</Select.Option>
                  </Select>
                </Form.Item>
                { activeRequest?.request.contentType === 'application/json' ? <Editor mode="json" value={activeRequest?.request.body} onChange={body => updateTab({ body })} /> : '' }
                { activeRequest?.request.contentType === 'multipart/form-data' ? <FieldList name="forms" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add field" useTypeField /> : '' }
                { activeRequest?.request.contentType === 'application/x-www-form-urlencoded' ? <FieldList name="formsEncoded" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add field" /> : '' }
              </Tabs.TabPane>
            </Tabs>
          </Form>
          <Divider />
          <Spin spinning={isLoading}>
            <Typography.Paragraph type="secondary">
              Response <Typography.Text>{activeRequest?.response?.status}</Typography.Text>
              <Typography.Text style={{ float: 'right' }}>
                { activeRequest?.response?.responseTime ? `${activeRequest?.response?.responseTime} ms` : '' }
              </Typography.Text>
            </Typography.Paragraph>
            <Tabs defaultActiveKey="0">
              <Tabs.TabPane tab="Body" key="0">
                <Editor
                  mode={findMode()}
                  value={typeof activeRequest?.response?.body === 'object' ? JSON.stringify(activeRequest?.response?.body, null, 2) : activeRequest?.response?.body || ''}
                  onChange={body => updateTab({ body })}
                  options={{ maxLines: Infinity, readOnly: true }} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Headers" key="1">

              </Tabs.TabPane>
            </Tabs>
          </Spin>
        </Tabs.TabPane>
      )) }
    </Tabs>
  )
}

export default Main
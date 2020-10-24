import { ShareAltOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message, Select, Tabs, Tag, Typography } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Modal from 'antd/lib/modal/Modal'
import Axios, { AxiosBasicCredentials, AxiosRequestConfig } from 'axios'
import qs from 'qs'
import queryString from 'query-string'
import React, { useCallback, useEffect, useState } from 'react'
import { generate as createId } from 'shortid'
import Editor from './components/Editor'
import FieldList from './components/FieldList'
import GettingStarted from './components/GettingStarted'
import ResponseSection from './components/ResponseSection'

type Response = {
  status: number,
  body: any,
  responseTime?: number,
  headers: any,
  debugLog?: any,
  isLoading?: boolean
}

type Request = {
  method: string,
  contentType?: string,
  url?: string,
  headers?: any,
  body?: any,
  forms?: any[],
  formsEncoded?: any[],
  params?: any[],
  basicAuth?: Partial<AxiosBasicCredentials>,
  axiosConfig?: string
}

type RequestData = {
  id: string,
  title: any,
  request: Request,
  response?: Response
}

interface Props {
  onSend: () => void,
  appendRequest?: any,
  onAppend?: () => void,
  goToSettings: () => any
}

const Main: React.FC<Props> = ({ onSend, appendRequest, onAppend, goToSettings }) => {
  const [form] = useForm()
  const [requestData, setRequestData] = useState<RequestData[]>()
  const [activeRequest, setActiveRequest] = useState<RequestData>()
  const [activeTab, setActiveTab] = useState<string>()
  const [showShareModal, setShowShareModal] = useState<boolean>(false)
  const [curl, setCurl] = useState<any>()

  const buildInitialRequestData = (): RequestData => ({
    id: createId(),
    title: () => <>Untitled</>,
    request: {
      method: 'get',
      axiosConfig: '{\r\n  "timeout": 15000\r\n}'
    }
  })

  const buildTitle = useCallback((data: Partial<Request>) => {
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

    const urlParsed = (data.url || activeRequest?.request.url)?.split('?')[0]?.replace(/^http[s]*:\/\//gi, '')
    return () => <>
      <Tag color={color}>{(data?.method || activeRequest?.request.method)?.toUpperCase()}</Tag> {urlParsed ? urlParsed?.substr(0, 12) + (urlParsed?.length > 12 ? '...' : '') : 'Untitled'}
    </>
  }, [activeRequest])

  const mutateTabs = (key: any, action: string) => {
    if (action === 'add') {
      const initial = buildInitialRequestData()
      setRequestData([...requestData || [], initial])
      setActiveTab(initial.id)
    } else if (action === 'remove') {
      const updateTabs = [...requestData || []].filter(req => req.id !== key)
      setRequestData(updateTabs)
      if (activeTab === key) {
        setActiveTab(updateTabs?.[0]?.id)
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const updateTab = async (data: Partial<Request>, resp?: Partial<Response>) => {
    const title = buildTitle(data)
    if (activeRequest && requestData) {
      const idx = requestData?.indexOf(requestData!.find(req => req.id === activeRequest.id)!)
      const requests = [...requestData]
      const params = data.params === undefined ? requests[idx]?.request.params : data.params || []
      requests[idx] = {
        ...requests[idx],
        title,
        request: {
          ...requests[idx].request,
          ...data,
          url: queryString.stringifyUrl({
            url: (data.url !== undefined ? data.url : requests[idx]?.request?.url || '').split('?')[0],
            query: params?.reduce((res: any, param: any) => ({ ...res, [param.key]: param.value }), {}) || {}
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

  useEffect(() => {
    if (appendRequest) {
      const request = { ...appendRequest, id: createId(), title: buildTitle(appendRequest.request) }
      setRequestData([...requestData || [], request])
      setActiveTab(request.id)
      onAppend?.()
    }
  }, [requestData, appendRequest, onAppend, buildTitle])

  useEffect(() => {
    if (requestData !== undefined) {
      window.localStorage.setItem('requestData', JSON.stringify(requestData))
    }
    if (activeTab) {
      window.localStorage.setItem('activeTab', activeTab)
    }
  }, [requestData, activeTab])

  useEffect(() => {
    if (requestData === undefined && window.localStorage.getItem('requestData')) {
      try {
        const data = JSON.parse(window.localStorage.getItem('requestData')!)
        setRequestData(data?.map((req: RequestData) => ({ ...req, title: buildTitle(req.request) })))
        setActiveTab(window.localStorage.getItem('activeTab') || data[0].id)
      } catch (error) {
        // ignore
      }
    }
  }, [requestData, buildTitle])

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

  const send = async () => {
    const params = activeRequest?.request.params?.reduce((res: any, param: any) => ({ ...res, [param.key]: param.value }), {})
    const headers = activeRequest?.request.headers?.reduce((res: any, header: any) => ({ ...res, [header.key]: header.value }), {})
    if (!activeRequest?.request.url) {
      return message.error('Please fill the URL first')
    }
    updateTab({}, { isLoading: true })
    let method = activeRequest.request.method
    if (method === 'del') {
      method = 'delete'
    } else if (method === 'opt') {
      method = 'options'
    }

    let body: any = null
    if (activeRequest.request.contentType === 'application/json' && activeRequest.request.body) {
      body =  activeRequest.request.body
    } else if (activeRequest.request.contentType === 'application/x-www-form-urlencoded' && activeRequest.request.formsEncoded) {
      body = qs.stringify(activeRequest?.request.formsEncoded?.reduce((res: any, field: any) => ({ ...res, [field.key]: field.value }), {}))
    } else if (activeRequest.request.contentType === 'multipart/form-data' && activeRequest.request.forms) {
      body = activeRequest?.request.forms?.reduce(
        (res: any, field: any) => ({ ...res, [field.key]: field.type === 'string' ? field.value : {
          base64: field.fileBase64,
          file: {
            name: field.file.name,
            size: field.file.size,
            type: field.file.type,
            lastModified: field.file.lastModified,
            lastModifiedDate: field.file.lastModifiedDate,
          }
        } }), {})
    }

    const options: AxiosRequestConfig = {
      method: method as any,
      url: activeRequest.request.url,
      params: params || {},
      headers: {
        ...headers,
        ...activeRequest?.request.contentType && activeRequest.request.contentType !== 'none' ? {
          contentType: activeRequest.request.contentType,
        } : {}
      } || {},
      ...activeRequest?.request.basicAuth ? { auth: activeRequest?.request.basicAuth as AxiosBasicCredentials } : {},
      data: body,
      ...activeRequest?.request.axiosConfig ? JSON.parse(activeRequest?.request.axiosConfig) : {}
    }

    const { data } = await Axios.post(window.localStorage.getItem('proxy') || process.env.REACT_APP_PROXY || '/proxy', options)

    let savedResponse: Partial<Response> = {}
    if (data?.error) {
      const { error, response } = data
      if (response) {
        savedResponse = {
          isLoading: false,
          status: response?.status,
          body: response?.data || JSON.stringify(error),
          headers: response?.headers,
          responseTime: new Date(response.config.metadata.endTime).getTime() - new Date(response.config.metadata.startTime).getTime(),
          debugLog: data
        }
      } else {
        savedResponse = {
          isLoading: false,
          headers: { 'content-type': 'application/json' },
          body: typeof error === 'object' ? JSON.stringify(error, null, 2) : error.toString(),
          responseTime: 0,
          status: 0,
          debugLog: data
        }
        message.error('Something error, please check the debug panel for the details')
      }
    } else {
      savedResponse = {
        isLoading: false,
        status: data.status,
        body: data?.data || data,
        headers: data.headers,
        responseTime: (data as any).duration,
        debugLog: data
      }
    }
    updateTab({}, savedResponse)

    window.localStorage.setItem('histories', JSON.stringify(
      [{ ...activeRequest, response: savedResponse }, ...(window.localStorage.getItem('histories') ? JSON.parse(window.localStorage.getItem('histories')!) : []).slice(0, 15)]
    ))
    onSend()
  }

  const share = async () => {
    setShowShareModal(true)
    let method = activeRequest?.request.method || 'get'
    if (method === 'del') {
      method = 'delete'
    } else if (method === 'opt') {
      method = 'options'
    }
    let result = `curl --location --request ${method.toUpperCase()} '${activeRequest?.request.url}'`
    if (activeRequest?.request.contentType) {
      result = `${result} \\\n--header 'Content-Type: ${activeRequest?.request.contentType}'`
    }
    const header = activeRequest?.request.headers?.map((header: any) => `--header '${header.key}: ${header.value}'`)
    if (header?.length) {
      result = `${result} \\\n${header.join(' \\\n')}`
    }
    if (activeRequest?.request.basicAuth) {
      result = `${result} \\\n--header 'Authorization: Basic ${Buffer.from(`${activeRequest?.request.basicAuth.username}:${activeRequest.request.basicAuth.password}`).toString('base64')}'`
    }
    if (activeRequest?.request.contentType === 'multipart/form-data') {
      const forms = activeRequest?.request.forms?.map((form: any) => `--form '${form.key}=${form.type === 'file' ? `@${form.file.name}` : form.value}'`)
      if (forms?.length) {
        result = `${result} \\\n${forms.join(' \\\n')}`
      }
    }
    if (activeRequest?.request.contentType === 'application/x-www-form-urlencoded') {
      const forms = activeRequest?.request.formsEncoded?.map((form: any) => `--data-urlencode '${form.key}=${form.value}'`)
      if (forms?.length) {
        result = `${result} \\\n${forms.join(' \\\n')}`
      }
    }
    if (activeRequest?.request.contentType === 'application/json') {
      result = `${result} \\\n--data-raw '${activeRequest.request.body}'`
    }
    setCurl(result)
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
    <>
      <Tabs defaultActiveKey={activeTab?.toString() || requestData?.[0]?.id} activeKey={activeTab} type="editable-card" onEdit={mutateTabs} onChange={setActiveTab} size="small">
        { requestData?.map(tab => (
          <Tabs.TabPane tab={<tab.title />} key={tab.id}>
            <Form form={form} onFinish={send}>
              <Form.Item name="url">
                <span style={{ display: 'flex' }}>
                  <Input.Search
                    placeholder="Enter URL"
                    addonBefore={<SelectMethod />}
                    enterButton="Send"
                    value={tab?.request?.url}
                    required
                    onSearch={send}
                    onChange={e => updateTab({ url: e.target.value || '' })} />
                  <Button disabled={!activeRequest?.request.url} onClick={share} type="link" style={{ marginLeft: '5px' }} icon={<ShareAltOutlined />}></Button>
                </span>
              </Form.Item>
              <Tabs defaultActiveKey="0">
                <Tabs.TabPane tab="Params" key="0">
                  <FieldList name="params" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add param" />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Headers" key="1">
                  <FieldList name="headers" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add header" />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Basic Auth" key="2">
                  <Form.Item label="Username" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    <Input
                      value={activeRequest?.request.basicAuth?.username}
                      onChange={e => updateTab({ basicAuth: { ...activeRequest?.request.basicAuth, username: e.target.value } })} />
                  </Form.Item>
                  <Form.Item label="Password" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    <Input.Password
                      value={activeRequest?.request.basicAuth?.password}
                      onChange={e => updateTab({ basicAuth: { ...activeRequest?.request.basicAuth, password: e.target.value } })} />
                  </Form.Item>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Body" key="3">
                  <Form.Item label="Content Type" wrapperCol={{ lg: { span: 6 }, md: { span: 12 } }}>
                    <Select style={{ minWidth: '240px' }} defaultValue={activeRequest?.request.contentType || 'none'} onChange={e => updateTab({ contentType: e })}>
                      <Select.Option value="none">none</Select.Option>
                      <Select.Option value="multipart/form-data">multipart/form-data</Select.Option>
                      <Select.Option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</Select.Option>
                      <Select.Option value="application/json">application/json</Select.Option>
                    </Select>
                  </Form.Item>
                  { activeRequest?.request.contentType === 'application/json' ? <><Editor mode="json" defaultValue={activeRequest?.request.body} onChange={body => updateTab({ body })} /><br /></> : '' }
                  { activeRequest?.request.contentType === 'multipart/form-data' ? <FieldList name="forms" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add field" useTypeField /> : '' }
                  { activeRequest?.request.contentType === 'application/x-www-form-urlencoded' ? <FieldList name="formsEncoded" form={form} tab={tab} activeRequest={activeRequest} updateTab={updateTab} buttonAddText="Add field" /> : '' }
                </Tabs.TabPane>
                <Tabs.TabPane tab="Axios Config" key="4">
                  <Typography.Paragraph type="secondary">
                    Read this for the details: <a href="https://github.com/axios/axios#request-config" target="_blank" rel="noopener noreferrer">https://github.com/axios/axios#request-config</a>
                  </Typography.Paragraph>
                  <Editor mode="json" defaultValue={activeRequest?.request.axiosConfig} onChange={axiosConfig => updateTab({ axiosConfig })} />
                  <br />
                </Tabs.TabPane>
              </Tabs>
            </Form>
            <ResponseSection activeRequest={activeRequest} />
          </Tabs.TabPane>
        )) }
      </Tabs>
      { !requestData?.length ? <GettingStarted init={() => {
        const initial = buildInitialRequestData()
        setRequestData([initial])
        setActiveTab(initial.id)
      }} goToSettings={goToSettings} /> : '' }
      <Modal
        visible={showShareModal}
        onCancel={() => setShowShareModal(false)}
        onOk={() => setShowShareModal(false)}
        title={<><ShareAltOutlined /> Share Request</>}>
        <Card title="cURL snippets">
          {curl?.split('\n')?.map((line: string) => (<>{line}<br /></>))}
        </Card>
      </Modal>
    </>
  )
}

export default Main
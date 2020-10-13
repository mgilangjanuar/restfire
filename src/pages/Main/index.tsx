import { Form, Input, Select, Tabs, Tag } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect, useState } from 'react'
import { generate as createId } from 'shortid'

type RequestData = {
  id: string,
  title: any,
  request: {
    method: string,
    url?: string,
    headers?: any,
    requestBody?: any,
    responseBody?: any,
    responseHeaders?: any
  }
}

const Main: React.FC = () => {
  const [form] = useForm()
  const [requestData, setRequestData] = useState<RequestData[]>()
  const [activeRequest, setActiveRequest] = useState<RequestData>()
  const [activeTab, setActiveTab] = useState<string>()

  const buildInitialRequestData = () => ({
    id: createId(),
    title: 'Untitled',
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
    if (action === 'add') {
      setRequestData([...requestData || [], buildInitialRequestData()])
    } else if (action === 'remove') {
      setRequestData(requestData?.filter(req => req.id !== key))
    }
  }

  const updateTab = async (data: any) => {

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
    const Method = () => <Tag color={color}>{(data?.method || activeRequest?.request.method)?.toUpperCase()}</Tag>
    const Title = () => <><Method /> {urlParsed ? urlParsed?.substr(0, 12) + (urlParsed?.length > 12 ? '...' : '') : 'Untitled'}</>
    setActiveRequest({
      ...activeRequest!,
      title: <Title />,
      request: {
        ...activeRequest!.request,
        ...data.method ? { method: data.method } : {},
        ...data.url ? { url: data.url } : {}
      }
    })
    if (activeRequest && requestData) {
      const idx = requestData?.indexOf(requestData!.find(req => req.id === activeRequest.id)!)
      const requests = [...requestData]
      console.log(idx, requests[idx])
      requests[idx] = {
        ...requests[idx],
        title: <Title />,
        request: {
          ...requests[idx].request,
          ...data.method ? { method: data.method } : {},
          ...data.url ? { url: data.url } : {}
        }
      }
      setRequestData(requests)
    }
  }

  const SelectMethod = () => (
    <Select
      defaultValue={activeRequest?.request?.method || 'get'}
      value={activeRequest?.request.method}
      onChange={e => updateTab({ method: e })}
      style={{ minWidth: '120px' }}
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
    <Tabs defaultActiveKey={activeTab?.toString() || '0'} type="editable-card" onEdit={mutateTabs} onChange={setActiveTab} size="small">
      { requestData?.map(tab => (
        <Tabs.TabPane tab={tab.title} key={tab.id}>
          <Form form={form}>
            <Form.Item name="url">
              <span>
                <Input.Search
                  size="large"
                  placeholder="Enter URL"
                  addonBefore={<SelectMethod />}
                  enterButton="Send"
                  value={tab?.request?.url}
                  onChange={e => updateTab({ url: e.target.value })} />
              </span>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      )) }
    </Tabs>
  )
}

export default Main
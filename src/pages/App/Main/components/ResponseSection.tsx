import { Descriptions, Spin, Tabs, Typography } from 'antd'
import React from 'react'
import Editor from './Editor'

interface Props {
  activeRequest?: any
}

const ResponseSection: React.FC<Props> = ({ activeRequest }) => {
  const findMode = (): string => {
    const candidate = activeRequest?.response?.headers?.['content-type']?.split(';')[0].split('/')?.[1]
    if (!candidate || candidate === 'plain') {
      return 'plain_text'
    }
    return candidate
  }

  return (
    <Spin spinning={!!activeRequest?.response?.isLoading}>
      <Typography.Paragraph type="secondary">
        Response {activeRequest?.response?.status ? <Typography.Text>{activeRequest?.response?.status}</Typography.Text> : '' }
        <Typography.Text style={{ float: 'right' }}>
          { activeRequest?.response?.responseTime ? `${activeRequest?.response?.responseTime} ms` : '' }
        </Typography.Text>
      </Typography.Paragraph>
      <Tabs defaultActiveKey="0">
        <Tabs.TabPane tab="Body" key="0">
          <Editor
            mode={findMode()}
            value={typeof activeRequest?.response?.body === 'object' ? JSON.stringify(activeRequest?.response?.body, null, 2) : activeRequest?.response?.body || ''}
            options={{ maxLines: Infinity, readOnly: true }} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Headers" key="1">
          <Descriptions column={1} bordered size="small">
            { activeRequest?.response?.headers && Object.keys(activeRequest.response.headers)?.map((header, i) => (
              <Descriptions.Item key={i} label={header}>{activeRequest?.response?.headers[header]}</Descriptions.Item>
            )) }
          </Descriptions>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Debug" key="2">
          { activeRequest?.response?.debugLog ? <pre>{JSON.stringify(activeRequest?.response?.debugLog, null, 2)}</pre> : '' }
        </Tabs.TabPane>
      </Tabs>
    </Spin>
  )
}

export default ResponseSection
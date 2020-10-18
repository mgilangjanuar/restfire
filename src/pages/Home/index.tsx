import { BulbOutlined, FireOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>()
  const { switcher, themes } = useThemeSwitcher()

  useEffect(() => {
    let theme = window.localStorage.getItem('theme')
    if (!theme) {
      window.localStorage.setItem('theme', 'dark')
      theme = 'dark'
    }
    setIsDarkMode(theme === 'dark')
    switcher({ theme: theme === 'dark' ? themes.dark : themes.light })
  }, [switcher, themes])

  return (
    <Layout>
      <Layout.Header style={{ padding: 0, ...isDarkMode ? {} : { backgroundColor: '#fff' } }}>
        <span style={{ fontSize: '1.2em', paddingLeft: '24px' }}><FireOutlined /> RestFire Studio</span>
        <Button style={{ float: 'right', top: '16px', right: '24px', display: 'inline' }} type="text" icon={<BulbOutlined />} shape="circle" onClick={() => setIsDarkMode(prev => {
          switcher({ theme: prev ? themes.light : themes.dark })
          localStorage.setItem('theme', prev ? 'light' : 'dark')
          return !prev
        })} />
      </Layout.Header>
      <Layout.Content style={{ margin: '7px 10px', padding: 24, minHeight: '90vh' }}>
        test
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        RestFire Studio &copy; 2020
      </Layout.Footer>
    </Layout>
  )
}

export default Home
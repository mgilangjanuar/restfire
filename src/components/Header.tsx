import { BulbOutlined, FireOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Layout, message } from 'antd'
import React, { useEffect } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link } from 'react-router-dom'

interface Props {
  withSidebar?: boolean,
  collapseLeft?: [boolean, (state: boolean) => any],
  defaultSelectedKey?: string
}

const Header: React.FC<Props> = ({ withSidebar, collapseLeft, defaultSelectedKey }) => {
  // const history = useHistory()
  const { switcher, themes, currentTheme } = useThemeSwitcher()

  useEffect(() => {
    if (currentTheme) {
      window.localStorage.setItem('theme', currentTheme!)
    }
  }, [currentTheme])

  const Title = () => (
    <span style={{ fontSize: '1.2em', paddingLeft: '24px', color: currentTheme === 'dark' ? '#fff' : '#000' }}>
      { collapseLeft?.[0] ? <>RestFire Studio</> : '' }
      { !withSidebar ? <><FireOutlined /> RestFire Studio</> : '' }
    </span>
  )

  const BulbButton = () => (
    <Button style={{ float: 'right', top: '16px', right: '24px', display: 'inline' }} type="text" icon={<BulbOutlined />} shape="circle" onClick={() => {
      message.info('Sorry for the blinking 😂', 0.8)
      switcher({ theme: currentTheme === 'dark' ? themes.light : themes.dark })
    }} />
  )

  return (
    <Layout.Header style={{ padding: 0, border: 'none', ...currentTheme === 'dark' ? { backgroundColor: '#000' } : { backgroundColor: '#f0f2f5' } }}>
      { withSidebar ? (
        <>
          <Button type="text" onClick={() => collapseLeft?.[1](!collapseLeft[0])}>
            { collapseLeft?.[0] ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
          </Button>
          <Title />
          <BulbButton />
        </>
      ) : (
        <>
          <div style={{ float: 'left' }}>
            <Link to="/"><Title /></Link>
          </div>
          {/* <Menu mode="horizontal" defaultSelectedKeys={[defaultSelectedKey || 'home']} style={{ border: 'none', display: 'flex', ...currentTheme === 'dark' ? { backgroundColor: '#000' } : { backgroundColor: '#f0f2f5' } }}>
            <Menu.Item key="home" onClick={() => history.push('/')}>Home</Menu.Item>
            <Menu.Item key="pricing" onClick={() => history.push('/pricing')}>Pricing</Menu.Item>
            <Menu.Item key="about" onClick={() => history.push('/about')}>About</Menu.Item>
            <Menu.Item key="privacy" onClick={() => history.push('/privacy')}>Privacy</Menu.Item>
            <Menu.Item key="terms" onClick={() => history.push('/terms')}>Terms</Menu.Item>
          </Menu> */}
          <BulbButton />
        </>
      ) }
    </Layout.Header>
  )
}

export default Header
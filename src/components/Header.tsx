import { BulbOutlined, FireOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import React, { useEffect } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Link } from 'react-router-dom'

interface Props {
  withSidebar?: boolean,
  collapseLeft?: [boolean, (state: boolean) => any]
}

const Header: React.FC<Props> = ({ withSidebar, collapseLeft }) => {
  const { switcher, themes, currentTheme } = useThemeSwitcher()

  useEffect(() => {
    if (currentTheme) {
      window.localStorage.setItem('theme', currentTheme!)
    }
  }, [currentTheme])

  return (
    <Layout.Header style={{ padding: 0, ...currentTheme === 'dark' ? {} : { backgroundColor: '#fff' } }}>
      { withSidebar ? (
        <Button type="text" onClick={() => collapseLeft?.[1](!collapseLeft[0])}>
          { collapseLeft?.[0] ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
        </Button>
      ) : '' }
      <Link to="/">
        <span style={{ fontSize: '1.2em', paddingLeft: '24px', color: currentTheme === 'dark' ? '#fff' : '#000' }}>
          { collapseLeft?.[0] ? <>RestFire Studio</> : '' }
          { !withSidebar ? <><FireOutlined /> RestFire Studio</> : '' }
        </span>
      </Link>
      <Button style={{ float: 'right', top: '16px', right: '24px', display: 'inline' }} type="text" icon={<BulbOutlined />} shape="circle" onClick={() => switcher({ theme: currentTheme === 'dark' ? themes.light : themes.dark })} />
    </Layout.Header>
  )
}

export default Header
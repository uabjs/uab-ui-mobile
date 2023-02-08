import './demo2.less'

import React, { FC } from 'react'
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons'

import { NavBar, TabBar } from 'uab-ui-mobile'

const Bottom: FC = () => {
  const setRouteActive = (value: string) => {
    console.log('value===', value)
  }

  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/todo',
      title: '待办',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/message',
      title: '消息',
      icon: <MessageOutline />,
    },
    {
      key: '/me',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  return (
    <TabBar activeKey={'/home'} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

export default () => {
  return (
    <div className={'app'}>
      <div className={'top'}>
        <NavBar>配合路由使用</NavBar>
      </div>
      <div className={'body'}>{<Home />}</div>
      <div className={'bottom'}>
        <Bottom />
      </div>
    </div>
  )
}

function Home() {
  return <div>首页</div>
}

function Todo() {
  return <div>待办</div>
}

function Message() {
  return <div>消息</div>
}

function PersonalCenter() {
  return <div>我的</div>
}

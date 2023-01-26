import React from 'react'
import { List } from 'uab-ui-mobile'

export default () => {
  function handleClick(event: MouseEvent): void {
    console.log(event.target)
  }

  return (
    <List mode='card' header='卡片列表'>
      <List.Item extra='按照支付设置的顺序扣款' onClick={handleClick}>
        扣款方式
      </List.Item>
      <List.Item extra='200元' onClick={handleClick}>
        月限额
      </List.Item>
      <List.Item onClick={handleClick}>帮助中心</List.Item>
      <List.Item onClick={handleClick}>服务设置</List.Item>
    </List>
  )
}

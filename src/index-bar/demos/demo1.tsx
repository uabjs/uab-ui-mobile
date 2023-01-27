import React from 'react'
import { IndexBar, List } from 'uab-ui-mobile'
import { lorem } from 'uab-ui-mobile-demos'

const charCodeOfA = 'A'.charCodeAt(0)

const getRandomList = (min: number, max: number): string[] => {
  return new Array(Math.floor(Math.random() * (max - min) + min)).fill('')
}

const groups = Array(26)
  .fill('')
  .map((_, i) => ({
    title: String.fromCharCode(charCodeOfA + i), // A B C D ...
    // 生成长度为 3 ~ 10 的字符串段落数组
    items: getRandomList(3, 10).map(() => lorem.generateParagraphs(2)),
  }))

export default () => {
  return (
    <div style={{ height: window.innerHeight }}>
      <IndexBar>
        {groups.map(group => {
          const { title, items } = group
          return (
            <IndexBar.Panel index={title} title={`标题${title}`} key={`标题${title}`}>
              <List>
                {items.map((item, index) => (
                  <List.Item key={index}>{item}</List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          )
        })}
      </IndexBar>
    </div>
  )
}

import './demo4.less'

import React, { useEffect, useRef, useState } from 'react'
import { SideBar } from 'uab-ui-mobile'
import { lorem } from 'uab-ui-mobile-demos'
import { useThrottleFn } from 'ahooks'

const items = [
  { key: '1', title: '第一项', text: lorem.generateParagraphs(8) },
  { key: '2', title: '第二项', text: lorem.generateParagraphs(8) },
  { key: '3', title: '第三项', text: lorem.generateParagraphs(8) },
  { key: '4', title: '第四项', text: lorem.generateParagraphs(8) },
]

export default () => {
  const [activeKey, setActiveKey] = useState('1')

  // 滚动截流 设置当前选中选项
  const { run: handleScroll } = useThrottleFn(
    () => {
      let currentKey = items[0].key
      for (const item of items) {
        const element = document.getElementById(`anchor-${item.key}`)
        if (!element) {
          continue
        }
        const rect = element.getBoundingClientRect()
        if (rect.top <= 0) {
          currentKey = item.key
        } else {
          break
        }
      }
      setActiveKey(currentKey)
    },
    { leading: true, trailing: true, wait: 100 }
  )

  const mainElementRef = useRef<HTMLDivElement>(null)

  // 监听滚动
  useEffect(() => {
    const mainElement = mainElementRef.current
    if (!mainElement) {
      return
    }
    mainElement.addEventListener('scroll', handleScroll)
    return () => {
      mainElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={'container'}>
      <div className={'side'}>
        <SideBar
          activeKey={activeKey}
          onChange={key => {
            document.getElementById(`anchor-${key}`)?.scrollIntoView()
          }}
        >
          {items.map(item => (
            <SideBar.Item key={item.key} title={item.title} />
          ))}
        </SideBar>
      </div>
      <div className={'main'} ref={mainElementRef}>
        {items.map(item => (
          <div key={item.key}>
            <h2 id={`anchor-${item.key}`}>{item.title}</h2>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

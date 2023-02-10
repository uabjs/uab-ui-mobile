import React, { ReactElement } from 'react'

/** 需要停止冒泡的事件 */
export type PropagationEvent = 'click'

/** 事件与事件名的映射 */
const eventToPropRecord: Record<PropagationEvent, string> = {
  click: 'onClick',
}

/** 更具参数1事件数组 阻止参数2元素的这些事件冒泡 */
export function withStopPropagation(events: PropagationEvent[], element: ReactElement) {
  const props: Record<string, any> = { ...element.props }
  for (const key of events) {
    const prop = eventToPropRecord[key]
    // 类似高阶函数，给 onClick 事件外面套一层
    props[prop] = function (e: Event) {
      e.stopPropagation()
      element.props[prop]?.(e)
    }
  }
  return React.cloneElement(element, props)
}

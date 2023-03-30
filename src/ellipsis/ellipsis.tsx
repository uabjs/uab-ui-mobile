import React, { FC, useMemo, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'ahooks'
import runes from 'runes'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { mergeProps } from '../utils/with-default-props'
import { PropagationEvent, withStopPropagation } from '../utils/with-stop-propagation'
import { useResizeEffect } from '../utils/use-resize-effect'

const classPrefix = `uabm-ellipsis`

export type EllipsisProps = {
  content: string
  direction?: 'start' | 'end' | 'middle'
  rows?: number
  expandText?: string
  collapseText?: string
  defaultExpanded?: boolean
  stopPropagationForActionButtons?: PropagationEvent[]
  onContentClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
} & NativeProps

const defaultProps = {
  direction: 'end',
  rows: 1,
  content: '',
  expandText: '',
  collapseText: '',
  defaultExpanded: false,
  stopPropagationForActionButtons: [],
  onContentClick: () => {},
}

type EllipsisedValue = {
  leading?: string
  tailing?: string
}

export const Ellipsis: FC<EllipsisProps> = p => {
  const props = mergeProps(defaultProps, p)
  const rootRef = useRef<HTMLDivElement>(null)

  const [ellipsised, setEllipsised] = useState<EllipsisedValue>({})
  // 展开
  const [expanded, setExpanded] = useState(props.defaultExpanded)
  // 是否需要显示缩放按钮
  const [exceeded, setExceeded] = useState(false)

  const chars = useMemo(() => runes(props.content), [props.content])
  function getSubString(start: number, end: number) {
    return chars.slice(start, end).join('')
  }

  /** 模拟一个展开所有内容的 div，挂载到 dom 上。 获取实际内容高度判断是否需要开启省略 */
  function calcEllipsised() {
    const root = rootRef.current
    if (!root) return
    if (!root.offsetParent) return

    const originStyle = window.getComputedStyle(root)
    // 模拟一个全部展示内容的div: 把 rootRef 的属性复制到 container 上
    const container = document.createElement('div')
    const styleNames: string[] = Array.prototype.slice.apply(originStyle)
    styleNames.forEach(name => {
      container.style.setProperty(name, originStyle.getPropertyValue(name))
    })
    container.style.position = 'fixed'
    container.style.left = '999999px'
    container.style.top = '999999px'
    container.style.zIndex = '-1000'
    container.style.height = 'auto'
    container.style.minHeight = 'auto'
    container.style.maxHeight = 'auto'
    container.style.textOverflow = 'clip'
    container.style.whiteSpace = 'normal'
    container.style.webkitLineClamp = 'unset'
    container.style.display = 'block'

    const lineHeight = pxToNumber(originStyle.lineHeight)
    // 计算出不需要省略的高度，如果实际内容大于这个高度就需要开启省略
    const maxHeight = Math.floor(
      lineHeight * (props.rows + 0.5) +
        pxToNumber(originStyle.paddingTop) +
        pxToNumber(originStyle.paddingBottom)
    )
    // 添加上所有内容
    container.innerText = props.content
    // 添加到 dom 上
    document.body.appendChild(container)

    // 内容高度小于开启省略的高度，不需要省略
    if (container.offsetHeight <= maxHeight) {
      setExceeded(false)
    }
    // 内容高度大于开启省略的高度，需要省略
    else {
      setExceeded(true)
      const end = props.content.length
      // 当前按钮名字
      const actionText = expanded ? props.collapseText : props.expandText

      /** 二分递归算法，计算出刚好塞满开启省略高度以内的收起内容 */
      function check(left: number, right: number): EllipsisedValue {
        if (right - left <= 1) {
          if (props.direction === 'end') {
            return {
              leading: getSubString(0, left) + '...',
            }
          } else {
            return {
              tailing: '...' + getSubString(right, end),
            }
          }
        }

        const middle = Math.round((left + right) / 2)
        if (props.direction === 'end') {
          container.innerText = getSubString(0, middle) + '...' + actionText
        } else {
          container.innerText = actionText + '...' + getSubString(middle, end)
        }
        if (container.offsetHeight <= maxHeight) {
          if (props.direction === 'end') {
            return check(middle, right)
          } else {
            return check(left, middle)
          }
        } else {
          if (props.direction === 'end') {
            return check(left, middle)
          } else {
            return check(middle, right)
          }
        }
      }

      /** 二分递归算法，计算出两端刚好塞满开启省略高度以内的收起内容 */
      function checkMiddle(
        leftPart: [number, number],
        rightPart: [number, number]
      ): EllipsisedValue {
        if (leftPart[1] - leftPart[0] <= 1 && rightPart[1] - rightPart[0] <= 1) {
          return {
            leading: getSubString(0, leftPart[0]) + '...',
            tailing: '...' + getSubString(rightPart[1], end),
          }
        }
        const leftPartMiddle = Math.floor((leftPart[0] + leftPart[1]) / 2)
        const rightPartMiddle = Math.ceil((rightPart[0] + rightPart[1]) / 2)
        container.innerText =
          getSubString(0, leftPartMiddle) +
          '...' +
          actionText +
          '...' +
          getSubString(rightPartMiddle, end)
        if (container.offsetHeight <= maxHeight) {
          return checkMiddle([leftPartMiddle, leftPart[1]], [rightPart[0], rightPartMiddle])
        } else {
          return checkMiddle([leftPart[0], leftPartMiddle], [rightPartMiddle, rightPart[1]])
        }
      }

      const middle = Math.floor((0 + end) / 2)
      const ellipsised =
        props.direction === 'middle' ? checkMiddle([0, middle], [middle, end]) : check(0, end)
      setEllipsised(ellipsised)
    }
    // 计算完成后从 dom 上删除虚拟节点
    document.body.removeChild(container)
  }

  useResizeEffect(calcEllipsised, rootRef)

  /** 收起按钮 */
  const collapseActionElement =
    exceeded && props.collapseText
      ? withStopPropagation(
          props.stopPropagationForActionButtons,
          <a
            onClick={() => {
              setExpanded(false)
            }}
          >
            {props.collapseText}
          </a>
        )
      : null // 内容不满足省略长度，不需要按钮

  /** 展开按钮 */
  const expandActionElement =
    exceeded && props.expandText
      ? withStopPropagation(
          props.stopPropagationForActionButtons,
          <a
            onClick={() => {
              setExpanded(true)
            }}
          >
            {props.expandText}
          </a>
        )
      : null // 内容不满足省略长度，不需要按钮

  const renderContent = () => {
    // 内容不满足省略长度，不需要省略
    if (!exceeded) {
      return props.content
    }

    // 展开
    if (expanded) {
      return (
        <>
          {props.content}
          {collapseActionElement}
        </>
      )
    }
    // 折叠
    else {
      return (
        <>
          {/* 前面的文字: middle | end 会显示 */}
          {ellipsised.leading}
          {expandActionElement}
          {/* 后面的文字: middle | start 会显示 */}
          {ellipsised.tailing}
        </>
      )
    }
  }

  return withNativeProps(
    props,
    <div
      ref={rootRef}
      className={classPrefix}
      onClick={e => {
        if (e.target === e.currentTarget) {
          props.onContentClick(e)
        }
      }}
    >
      {renderContent()}
    </div>
  )
}

function pxToNumber(value: string | null): number {
  if (!value) return 0
  const match = value.match(/^\d*(\.\d*)?/)
  return match ? Number(match[0]) : 0
}

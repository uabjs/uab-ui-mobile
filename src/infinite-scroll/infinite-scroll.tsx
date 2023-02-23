import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { useLockFn, useThrottleFn } from 'ahooks'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { getScrollParent } from '../utils/get-scroll-parent'
import { mergeProps } from '../utils/with-default-props'
import { useConfig } from '../config-provider'
import DotLoading from '../dot-loading'

const classPrefix = `uabm-infinite-scroll`

function isWindow(element: any | Window): element is Window {
  return element === window
}

export type InfiniteScrollProps = {
  loadMore: (isRetry: boolean) => Promise<void>
  hasMore: boolean
  threshold?: number
  children?: ReactNode | ((hasMore: boolean, failed: boolean, retry: () => void) => ReactNode)
} & NativeProps

// 必须包含 InfiniteScrollProps 对象的 'threshold' 和 'children' 两个属性。
const defaultProps: Required<Pick<InfiniteScrollProps, 'threshold' | 'children'>> = {
  threshold: 250,
  children: (hasMore: boolean, failed: boolean, retry: () => void) => (
    <InfiniteScrollContent hasMore={hasMore} failed={failed} retry={retry} />
  ),
}

export const InfiniteScroll: FC<InfiniteScrollProps> = p => {
  const props = mergeProps(defaultProps, p)
  const elementRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  // useLockFn: 锁定函数：当函数正在执行时，阻止其被再次调用
  const doLoadMore = useLockFn(async (isRetry: boolean) => {
    try {
      await props.loadMore(isRetry)
    } catch (e) {
      setFailed(true)
      throw e
    }
  })

  const [scrollParent, setScrollParent] = useState<Window | Element | null | undefined>()

  // 防止重复触发 check 函数
  const [flag, setFlag] = useState({})
  const nextFlagRef = useRef(flag)

  const { run: check } = useThrottleFn(
    async () => {
      if (nextFlagRef.current !== flag) return
      if (!props.hasMore) return
      const element = elementRef.current
      if (!element) return
      // display 设置为 "none" 时 offsetParent 返回 null
      if (!element.offsetParent) return
      // offsetTop 和 offsetLeft 都是相对于 parent 内边距边界的。
      const parent = getScrollParent(element)
      setScrollParent(parent)
      if (!parent) return
      // rect 提供了元素的大小及其相对于视口的位置。
      const rect = element.getBoundingClientRect()
      // elementTop：'加载中头部' 距离 滚动框顶部的距离（区间：[滚动框高 - '加载中'高，滚动列表高]）
      const elementTop = rect.top
      // current：滚动框高
      const current = isWindow(parent) ? window.innerHeight : parent.getBoundingClientRect().bottom
      // 重点：滚动框高 >= ('加载中头部'到滚动框顶部的距离 - 自定义触发距离)
      if (current >= elementTop - props.threshold) {
        // 走到这里时改变 nextFlagRef.current 的值，组件不重新渲染时下次进来第一行会return掉
        const nextFlag = {}
        nextFlagRef.current = nextFlag
        await doLoadMore(false)
        setFlag(nextFlag)
      }
    },
    {
      wait: 100, // 截流 100 ms
      leading: true, // 触发第一次执行
      trailing: true, // 触发最后一次执行
    }
  )

  // 确保在内容更改时触发“loadMore”
  useEffect(() => {
    check()
  })

  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    if (!scrollParent) return
    function onScroll() {
      check()
    }

    scrollParent.addEventListener('scroll', onScroll)
    return () => {
      scrollParent.removeEventListener('scroll', onScroll)
    }
  }, [scrollParent])

  async function retry() {
    setFailed(false)
    await doLoadMore(true)
    setFlag(nextFlagRef.current)
  }

  return withNativeProps(
    props,
    <div className={classPrefix} ref={elementRef}>
      {typeof props.children === 'function'
        ? props.children(props.hasMore, failed, retry)
        : props.children}
    </div>
  )
}

type InfiniteScrollContentProps = {
  hasMore: boolean
  failed: boolean
  retry: () => void
}

const InfiniteScrollContent: FC<InfiniteScrollContentProps> = props => {
  const { locale } = useConfig()

  // 没有更多了
  if (!props.hasMore) {
    return <span>{locale.InfiniteScroll.noMore}</span>
  }

  if (props.failed) {
    return (
      <span>
        <span className={`${classPrefix}-failed-text`}>
          {/* 加载失败 */}
          {locale.InfiniteScroll.failedToLoad}
        </span>
        <a
          onClick={() => {
            props.retry()
          }}
        >
          {/* 重新加载 */}
          {locale.InfiniteScroll.retry}
        </a>
      </span>
    )
  }

  return (
    <>
      {/* 加载中  */}
      <span>{locale.common.loading}</span>
      <DotLoading />
    </>
  )
}

import React, { FC, useEffect, useRef } from 'react'
import { useInViewport } from 'ahooks'

type LazyDetectorProps = {
  onActive: () => void
}

/** 监听元素是否在可见区域内, 在执行 onActive 方法 */
export const LazyDetector: FC<LazyDetectorProps> = props => {
  const ref = useRef<HTMLDivElement>(null)
  const [inViewport] = useInViewport(ref)

  useEffect(() => {
    if (inViewport) {
      props.onActive()
    }
  }, [inViewport])

  return <div ref={ref} />
}

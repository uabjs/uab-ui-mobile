import { RefObject } from 'react'
import { useSpring } from '@react-spring/web'
import { clamp } from 'lodash'

export const useTabListScroll = (targetRef: RefObject<HTMLElement>, activeIndex: number | undefined) => {
  const [{ scrollLeft }, api] = useSpring(() => ({
    scrollLeft: 0,
    config: {
      tension: 300,
      clamp: true,
    },
  }))

  return {
    scrollLeft,
    animate,
  }
}

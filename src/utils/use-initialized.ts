import { useRef } from 'react'

/** 判断组件是否已经初始化过 */
export function useInitialized(check?: boolean) {
  const initializedRef = useRef(check)
  if (check) {
    initializedRef.current = true
  }
  return !!initializedRef.current
}

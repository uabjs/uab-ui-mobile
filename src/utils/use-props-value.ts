import { useRef, SetStateAction } from 'react'
import { useUpdate, useMemoizedFn } from 'ahooks'

type Options<T> = {
  value?: T
  defaultValue?: T
  onChange?: (v: T) => void
}

/** 设置一个ref值的改变，返回 [ref.current, set方法]，set会触发强制更新并触发传入的 onChange 方法 */
export function usePropsValue<T>(options: Options<T>) {
  const { value, defaultValue, onChange } = options

  const update = useUpdate()

  const stateRef = useRef<T>(value !== undefined ? value : defaultValue)
  if (value !== undefined) {
    stateRef.current = value
  }

  const setState = useMemoizedFn((v: SetStateAction<T>, forceTrigger = false) => {
    const nextValue = typeof v === 'function' ? (v as (prevState: T) => T)(stateRef.current) : v

    if (!forceTrigger && nextValue === stateRef.current) {
      return
    }
    stateRef.current = nextValue
    update()
    return onChange?.(nextValue)
  })

  return [stateRef.current, setState] as const
}

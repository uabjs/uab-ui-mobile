import { Globals } from '@react-spring/web'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

let reduced = false

const subscribers = new Set<() => void>()

function notify() {
  subscribers.forEach(subscriber => {
    subscriber()
  })
}

/** 减少运动 */
export function reduceMotion() {
  reduced = true
  notify()
  Globals.assign({
    skipAnimation: true,
  })
}

/** 恢复运动 */
export function restoreMotion() {
  reduced = false
  notify()
  Globals.assign({
    skipAnimation: false,
  })
}

/** 运动是否减少 */
export function isMotionReduced() {
  return reduced
}

export function useMotionReduced() {
  return useSyncExternalStore(onStoreChange => {
    subscribers.add(onStoreChange)
    return () => {
      subscribers.delete(onStoreChange)
    }
  }, isMotionReduced)
}

import { isDev } from './is-dev'

export function devWarning(component: string, message: string) {
  if (isDev) {
    console.warn(`[antd-mobile: ${component}] ${message}`)
  }
}

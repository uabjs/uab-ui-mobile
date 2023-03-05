import { isDev } from './is-dev'

export function devWarning(component: string, message: string) {
  if (isDev) {
    console.warn(`[uab-ui-mobile: ${component}] ${message}`)
  }
}

export function devError(component: string, message: string) {
  if (isDev) {
    console.error(`[uab-ui-mobile: ${component}] ${message}`)
  }
}

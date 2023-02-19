import { ReactElement } from 'react'
import * as ReactDOM from 'react-dom'
import { Root } from 'react-dom/client'

// 移植自rc-util: https://github.com/react-component/util/blob/master/src/React/render.ts
// 作用：渲染节点：react18版本使用 ReactDOM.createRoot 替换 ReactDOM.render

const MARK = '__uab_mobile_root__'

type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root
}

type CreateRoot = (container: ContainerType) => Root

let createRoot: CreateRoot

// 让编译器不搜索模块用法
const fullClone = {
  ...ReactDOM,
} as typeof ReactDOM & {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
    usingClientEntryPoint?: boolean
  }
  createRoot?: CreateRoot
}
const { version, render: reactRender, unmountComponentAtNode } = fullClone
try {
  const mainVersion = Number((version || '').split('.')[0])
  // react18版本使用 ReactDOM.createRoot 替换 ReactDOM.render
  if (mainVersion >= 18 && fullClone.createRoot) {
    createRoot = fullClone.createRoot
  }
} catch (e) {
  // Do nothing
}

function toggleWarning(skip: boolean) {
  const { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } = fullClone

  if (
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    typeof __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === 'object'
  ) {
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = skip
  }
}

/** react18并发渲染 */
function concurrentRender(node: ReactElement, container: ContainerType) {
  toggleWarning(true)
  const root = container[MARK] || createRoot(container)
  toggleWarning(false)
  root.render(node)
  container[MARK] = root
}

/** react旧版本渲染方式 */
function legacyRender(node: ReactElement, container: ContainerType) {
  reactRender(node, container)
}

/** 将参数1节点渲染到参数2容器上 */
export function render(node: ReactElement, container: ContainerType) {
  // react18版本渲染方式： ReactDOM.createRoot
  if (createRoot as unknown) {
    concurrentRender(node, container)
    return
  }
  // 旧版本渲染方式：ReactDOM.render
  legacyRender(node, container)
}

// ========================== Unmount =========================
async function concurrentUnmount(container: ContainerType) {
  // 延迟卸载以避免React 18同步警告
  return Promise.resolve().then(() => {
    container[MARK]?.unmount()
    delete container[MARK]
  })
}

function legacyUnmount(container: ContainerType) {
  return unmountComponentAtNode(container)
}

export function unmount(container: ContainerType) {
  if (createRoot as unknown) {
    return concurrentUnmount(container)
  }
  return legacyUnmount(container)
}

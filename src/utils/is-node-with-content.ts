import { ReactNode } from 'react'

// T 是不是继承 null | undefined | false 是就继承never 不是就继承自己
type Regulated<T> = T extends null | undefined | false ? never : T

/** 判断是不是具有内容的节点 */
export function isNodeWithContent(node: ReactNode): node is Regulated<ReactNode> {
  return node !== undefined && node !== null && node !== false
}

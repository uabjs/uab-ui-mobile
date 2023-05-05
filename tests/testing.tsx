import * as React from 'react'
// 测试 React 组件的 JavaScript 测试工具库。它提供了一组简单的 API，用于模拟用户与组件的交互，并对组件的输出进行断言。
import { RenderResult, act, render, RenderOptions } from '@testing-library/react'
// 测试 Web 应用程序是否符合 WCAG 2.0 AA 标准。
import { toHaveNoViolations, axe } from 'jest-axe'

expect.extend(toHaveNoViolations)

type UI = Parameters<typeof render>[0]

const AllTheProviders = ({ children }: { children: React.ReactElement }) => {
  return children
}

export interface TestOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: typeof AllTheProviders
}

export const customRender = (
  ui: UI,
  { wrapper: Wrapper = AllTheProviders, ...options }: TestOptions = {}
): RenderResult => render(<Wrapper>{ui}</Wrapper>, options)

export const testA11y = async (ui: UI | Element) => {
  const container = React.isValidElement(ui) ? customRender(ui).container : ui
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

export const sleep = (time: number) => new Promise<void>(resolve => setTimeout(resolve, time))

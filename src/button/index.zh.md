# Button 按钮

按钮用于触发一个即时操作，如提交表单。

## 示例

<code src="./demos/demo1.tsx"></code>


## Button

### 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| block | 是否是块级元素 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| fill | 填充模式 | `'solid' \| 'outline' \| 'none'` | `'solid'` |
| size | 大小 | `'mini' \| 'small' \| 'middle' \| 'large'` | `'middle'` |
| color | 按钮的颜色 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| loading | 是否处于加载状态，`'auto'` 模式会监听 `onClick` 的 `Promise` 状态自动更新 `loading` | `boolean \| 'auto'` | `false` |
| loadingIcon | 加载状态下的 `icon` 图标 | `ReactNode` | `<DotLoading color='currentColor' />` |
| loadingText | 加载状态下额外展示的文字 | `string` | - |
| onClick | 点击事件 | `(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void \| Promise<void>` | - |

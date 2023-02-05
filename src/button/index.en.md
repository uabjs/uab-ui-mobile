# Button

Used to start an immediate operation.

## Demos

<code src="./demos/demo1.tsx"></code>

## Button

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| block | Should the button displays as block element. | `boolean` | `false` |
| disabled | Should the button be disabled. | `boolean` | `false` |
| fill | The fill mode. | `'solid' \| 'outline' \| 'none'` | `'solid'` |
| size | The size of the button. | `'mini' \| 'small' \| 'middle' \| 'large'` | `'middle'` |
| color | The color of the button. | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| loading | Should the button displays as loading state. `'auto'` will update loading state based on the Promise state of `onClick` | `boolean \| 'auto'` | `false` |
| loadingIcon | The customized `icon` in loading state. | `ReactNode` | `<DotLoading color='currentColor' />` |
| loadingText | The extra text displayed in loading state. | `string` | - |
| onClick | The click event. | `(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void \| Promise<void>` | - |
| shape | The shape of the button. | `'default' \| 'rounded' \| 'rectangular'` | `'default'` |
| type | The `type` prop of native `button` element. | `'submit' \| 'reset' \| 'button'` | `'button'` |

In addition, the following properties of the native `button` element are supported: `onMouseDown` `onMouseUp` `onTouchStart` `onTouchEnd`.

### CSS Variables

| Name | Description | Default | Global |
| --- | --- | --- | --- |
| --background-color | Background color of the button. | `var(--uabm-color-white)` | `--uabm-button-background-color` |
| --border-color | Border color of the button. | `var(--uabm-border-color)` | `--uabm-button-border-color` |
| --border-radius | Border radius of the button. | `4px` | `--uabm-button-border-radius` |
| --border-style | Border style of the button. | `solid` | `--uabm-button-border-style` |
| --border-width | Border width of the button. | `1px` | `--uabm-button-border-width` |
| --text-color | Text color of the button. | `var(--uabm-color-text)` | `--uabm-button-text-color` |

### Ref

| Name          | Description           | Type                          |
| ------------- | --------------------- | ----------------------------- |
| nativeElement | Native button element | `HtmlButtonElement` \| `null` |

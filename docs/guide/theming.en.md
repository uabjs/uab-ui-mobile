# Theming

Thanks to the powerful and flexible capabilities of CSS variables, it is very simple to customize a set of uab-ui-mobile themes. You don’t need to configure any compilation tools or install additional plug-ins. You can fix it directly in `:root` to overwrite CSS Variables are fine:

```css
:root:root {
  --uabm-color-primary: #a062d4;
}
```

> Note: Why write two duplicate `:root`?
>
> Since the theme variables in uab-ui-mobile are also declared under `:root`, in some cases they cannot be successfully overwritten due to priority issues. Through `:root:root` you can explicitly make the content you write a higher priority to ensure the successful coverage of the theme variables.

Of course, if you just want to adjust the partial theme, you can also add the above CSS variable override logic to any node you want to adjust, for example:

```css
.purple-theme {
  --uabm-color-primary: #a062d4;
}
```

```jsx
<div className='purple-theme'>
  <Button color='primary'>Purple</Button>
</div>
```

You can get a button like this:

```jsx
/**
 * inline: true
 */

import React from 'react'
import { Button } from 'uab-ui-mobile'

export default () => {
  return (
    <div
      style={{
        ['--uabm-color-primary']: '#a062d4',
      }}
    >
      <Button color='primary'>Purple</Button>
    </div>
  )
}
```

The following are the global CSS variables currently provided by uab-ui-mobile:

```css
:root {
  --uabm-color-primary: #1677ff;
  --uabm-color-success: #00b578;
  --uabm-color-warning: #ff8f1f;
  --uabm-color-danger: #ff3141;

  --uabm-color-white: #ffffff;
  --uabm-color-text: #333333;
  --uabm-color-text-secondary: #666666;
  --uabm-color-weak: #999999;
  --uabm-color-light: #cccccc;
  --uabm-color-border: #eeeeee;
  --uabm-color-box: #f5f5f5;
  --uabm-color-background: #ffffff;

  --uabm-font-size-main: var(--uabm-font-size-5);

  --uabm-font-family: -apple-system, blinkmacsystemfont, 'Helvetica Neue', helvetica, segoe ui, arial,
    roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}
```

Besides, every component has its own global CSS variables.

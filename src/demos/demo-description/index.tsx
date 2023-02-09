import './index.less'

import React, { FC, ReactNode } from 'react'

export const DemoDescription: FC<{
  content?: ReactNode
  children?: ReactNode
}> = props => {
  return <div className={'demoDescription'}>{props.content || props.children}</div>
}

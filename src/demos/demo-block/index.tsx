import './index.less'

import React from 'react'

interface DemoBlockProps {
  title: string
  padding?: string
  background?: string
  children?: React.ReactNode
}

export const DemoBlock: React.FC<DemoBlockProps> = props => {
  return (
    <div className='demo-block'>
      <div className='demo-block-title'>{props.title}</div>
      <div
        className='demo-block-content'
        style={{
          padding: props.padding,
          background: props.background,
        }}
      >
        {props.children}
      </div>
    </div>
  )
}

DemoBlock.defaultProps = {
  padding: '12px',
  background: 'var(--uabm-color-background)',
}

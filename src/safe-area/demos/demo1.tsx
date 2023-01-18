import React from 'react'
import { SafeArea } from 'uab-ui-mobile'
import { lorem } from 'uab-ui-mobile-demos'

export default () => {
  return (
    <div>
      <div style={{ background: '#ace0ff' }}>
        <SafeArea position='top' />
      </div>
      <div>{lorem.generateParagraphs(10)}</div>
      <div style={{ background: '#ffcfac' }}>
        <SafeArea position='bottom' />
      </div>
    </div>
  )
}

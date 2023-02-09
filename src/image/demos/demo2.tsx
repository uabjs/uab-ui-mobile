import React, { useState } from 'react'
import { PictureWrongOutline } from 'antd-mobile-icons'
import { DotLoading, Image, Button } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  const imageSrcs = [
    'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60',
    'https://error123',
  ]

  const [success, setSuccess] = useState(true)
  const imageSrc = imageSrcs[success ? 0 : 1]

  return (
    <DemoBlock title='成功与失败'>
      <div>
        <Image
          src={imageSrc}
          placeholder={<DotLoading color='primary' />}
          fallback={
            <PictureWrongOutline style={{ fontSize: 96, color: 'var(--adm-color-weak)' }} />
          }
        />
      </div>
      <Button
        onClick={() => {
          setSuccess(!success)
        }}
      >
        toggle to {success ? 'error' : 'success'}
      </Button>
      {imageSrc}
    </DemoBlock>
  )
}

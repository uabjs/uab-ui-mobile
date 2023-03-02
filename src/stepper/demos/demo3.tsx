import React from 'react'
import { Stepper } from 'uab-ui-mobile'
import { DemoBlock } from 'uab-ui-mobile-demos'

export default () => {
  const [value, setValue] = React.useState('9999999999999999')

  return (
    <>
      <DemoBlock title='字符串模式'>
        <Stepper
          style={{ width: '100%' }}
          stringMode
          defaultValue='0.000000000000002'
          step='0.000000000000001'
          onChange={console.log}
        />
      </DemoBlock>

      <DemoBlock title='字符串模式控件'>
        <Stepper
          style={{ width: '100%' }}
          stringMode
          value={value}
          step='13579'
          onChange={setValue}
        />
      </DemoBlock>
    </>
  )
}

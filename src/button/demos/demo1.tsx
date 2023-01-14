import React from 'react'
import { Button } from 'uab-ui-mobile'

export default () => {
  return (
    <>
      <div>
        <h3>按钮颜色</h3>
        <Button>Default</Button>
        <Button color='primary'>Primary</Button>
        <Button color='success'>Success</Button>
        <Button color='danger'>Danger</Button>
        <Button color='warning'>Warning</Button>
      </div>

      <div>
        <h3>填充模式</h3>
        <Button color='primary' fill='solid'>
          solid
        </Button>
        <Button color='primary' fill='outline'>
          outline
        </Button>
        <Button color='primary' fill='none'>
          none
        </Button>
      </div>

      <div>
        <h3>按钮大小</h3>
        <Button color='primary' size='mini'>
          Mini
        </Button>
        <Button color='primary' size='small'>
          Small
        </Button>
        <Button color='primary' size='middle'>
          Middle
        </Button>
        <Button color='primary' size='large'>
          Large
        </Button>
      </div>
    </>
  )
}

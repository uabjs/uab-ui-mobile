import React from 'react'
import { Button } from 'uab-ui-mobile'
import { sleep } from 'uab-ui-mobile-utils'

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

      <div>
        <h3>块级按钮</h3>
        <Button color='primary' block>
          Black Button
        </Button>
      </div>

      <div>
        <h3>按钮形状</h3>
        <Button color='primary' shape='default'>
          Default Button
        </Button>
        <Button color='primary' shape='rounded'>
          Rounded Button
        </Button>
        <Button color='primary' shape='rectangular'>
          Rectangular Button
        </Button>
      </div>

      <div>
        <h3>禁用状态</h3>
        <Button disabled>Disabled</Button>
        <Button color='primary' disabled>
          Disabled
        </Button>
      </div>

      <div>
        <h3>加载状态</h3>
        <Button loading color='primary' loadingText='正在加载'>
          Loading
        </Button>
        <Button loading>Loading</Button>
        <Button
          loading='auto'
          onClick={async () => {
            await sleep(1000)
          }}
        >
          Auto Loading
        </Button>
      </div>
    </>
  )
}

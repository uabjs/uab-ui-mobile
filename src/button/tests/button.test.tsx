import React, { createRef } from 'react'
import { testA11y } from 'testing'
import Button from '..'
import type { ButtonRef } from '..'

const classPrefix = `uabm-button`

describe('Button', () => {
  test('a11y', async () => {
    await testA11y(<Button>test</Button>)
  })
})

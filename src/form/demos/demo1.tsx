import React from 'react'
import { Form, Button, Input } from 'uab-ui-mobile'

export default () => {
  return (
    <>
      <Form
        layout='horizontal'
        footer={
          <Button block type='submit' color='primary' size='large'>
            提交
          </Button>
        }
      >
        <Form.Header>水平布局表单</Form.Header>
        <Form.Item name='name' label='姓名' rules={[{ require: true, message: '姓名不能为空' }]}>
          <Input onChange={console.log} placeholder='请输入姓名' />
        </Form.Item>
      </Form>
    </>
  )
}

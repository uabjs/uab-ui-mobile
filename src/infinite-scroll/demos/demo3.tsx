import './demo3.less'

import React, { useEffect, useState } from 'react'
import { Button, InfiniteScroll, List, DotLoading } from 'uab-ui-mobile'
import { mockRequest } from './mock-request'

export default () => {
  const [data, setData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  async function loadMore() {
    const append = await mockRequest()
    setData(val => [...val, ...append])
    setHasMore(append.length > 0)
  }

  function doSearch() {
    setData([])
    setHasMore(true)
    loadMore()
  }

  useEffect(() => {
    doSearch()
  }, [])

  return (
    <>
      <div className={'header'}>
        <div className={'left'}>{/* <SearchBar /> */}</div>
        <div className={'right'}>
          <Button size='small' color='primary' onClick={doSearch}>
            搜索
          </Button>
        </div>
      </div>
      {data.length > 0 ? (
        <>
          <List>
            {data.map((item, index) => (
              <List.Item key={index}>{item}</List.Item>
            ))}
          </List>
          <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </>
      ) : (
        <div className={'placeholder'}>
          <div className={'loadingWrapper'}>
            <DotLoading />
          </div>
          正在拼命加载数据
        </div>
      )}
    </>
  )
}

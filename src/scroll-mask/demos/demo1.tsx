import React, { useRef } from 'react'
import { ScrollMask } from 'uab-ui-mobile'
import { DemoBlock, lorem } from 'uab-ui-mobile-demos'

const demoLongText = lorem.generateWords(20)

export default () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <DemoBlock title='基础用法' padding='0'>
        <div
          style={{
            position: 'relative',
          }}
        >
          <ScrollMask scrollTrackRef={scrollRef} />
          <div
            style={{
              height: 30,
              whiteSpace: 'nowrap',
              overflowX: 'scroll',
            }}
            ref={scrollRef}
          >
            {demoLongText}
          </div>
        </div>
      </DemoBlock>
    </>
  )
}

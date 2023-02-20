import React, { useEffect } from 'react'
import { ErrorBlock } from 'uab-ui-mobile'

export default () => {
  useEffect(() => {
    document.body.style.background = 'var(--uabm-color-background)'
  }, [])

  return <ErrorBlock fullPage />
}

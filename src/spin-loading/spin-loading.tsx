import React, { memo } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { mergeProps } from '../utils/with-default-props'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { useMotionReduced } from '../utils/reduce-and-restore-motion'

const classPrefix = 'uabm-spin-loading'

const colorRecord: Record<string, string> = {
  default: 'var(--uabm-color-weak)',
  primary: 'var(--uabm-color-primary)',
  white: 'var(--uabm-color-white)',
}

export type SpinLoadingProps = {
  color?: 'defalut' | 'primary' | 'white' | (string & {})
} & NativeProps<'--color' | '--size'>

const defaultProps = {
  color: 'default',
}

// 周长 = 2*15π
const circumference = 15 * 3.14159265358979 * 2

export const SpinLoading = memo<SpinLoadingProps>(p => {
  const props = mergeProps(defaultProps, p)
  const motionReduced = useMotionReduced()
  // 返回百分比
  const { percent } = useSpring({
    cancel: motionReduced,
    loop: {
      reverse: true,
    },
    from: {
      percent: 80,
    },
    to: {
      percent: 30,
    },
    config: {
      duration: 1200,
    },
  })

  return withNativeProps(
    props,
    <animated.div
      className={classPrefix}
      style={
        {
          '--color': colorRecord[props.color] ?? props.color,
          '--percent': percent,
        } as any
      }
    >
      <svg className={`${classPrefix}-svg`} viewBox='0 0 32 32'>
        <animated.circle
          className={`${classPrefix}-fill`}
          fill='transparent'
          strokeWidth='2'
          strokeDasharray={circumference}
          strokeDashoffset={percent}
          strokeLinecap='square'
          r={15}
          cx={16}
          cy={16}
        />
      </svg>
    </animated.div>
  )
})

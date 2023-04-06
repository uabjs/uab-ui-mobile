import React, { forwardRef } from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Page } from './convert'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { ArrowLeft } from './arrow-left'
import { ArrowLeftDouble } from './arrow-left-double'
import { mergeProps } from '../utils/with-default-props'
import classNames from 'classnames'

const classPrefix = 'uabm-calendar'

dayjs.extend(isoWeek)

export type CalendarProps = {
  // 上下月按钮
  prevMonthButton?: React.ReactNode
  nextMonthButton?: React.ReactNode
  // 上下年按钮
  prevYearButton?: React.ReactNode
  nextYearButton?: React.ReactNode
  // 年月改变回调
  onPageChange?: (year: number, month: number) => void
  // 日历每周以周几作为第一天：星期一 | 星期天
  weekStartsOn?: 'Monday' | 'Sunday'
  // 日期下面的文字标签
  renderLabel?: (date: Date) => React.ReactNode
  // 自定义日期样式渲染
  renderDate?: (date: Date) => React.ReactNode
  // 是否允许再次点击后清除
  allowClear?: boolean
  // 可选择的日期范围
  max?: Date
  min?: Date
  // 可切换的年月范围
  minPage?: Page
  maxPage?: Page
} & (
  | {
      selectionMode?: undefined
      value?: undefined
      defaultValue?: undefined
      onChange?: undefined
    }
  | {
      selectionMode: 'single'
      value?: Date | null
      defaultValue?: Date | null
      onChange?: (val: Date | null) => void
    }
  | {
      selectionMode: 'range'
      value?: [Date, Date] | null
      defaultValue?: [Date, Date] | null
      onChange?: (val: [Date, Date] | null) => void
    }
) &
  NativeProps

export type CalendarRef = {
  jumpToToday: () => void
}

const defaultProps = {
  weekStartsOn: 'Sunday',
  defaultValue: null,
  allowClear: true,
  prevMonthButton: <ArrowLeft />,
  nextMonthButton: <ArrowLeft />,
  prevYearButton: <ArrowLeftDouble />,
  nextYearButton: <ArrowLeftDouble />,
}

export const Calendar = forwardRef<CalendarRef, CalendarProps>((p, ref) => {
  const today = dayjs()
  const props = mergeProps(defaultProps, p)

  const header = (
    <div className={`${classPrefix}-header`}>
      <a
        className={`${classPrefix}-arrow-button ${classPrefix}-arrow-button-year`}
        onClick={() => {
          console.log('111111111')
        }}
      >
        {props.prevYearButton}
      </a>
      <a
        className={`${classPrefix}-arrow-button ${classPrefix}-arrow-button-month`}
        onClick={() => {
          console.log('22222222222')
        }}
      >
        {props.prevMonthButton}
      </a>
      <div className={`${classPrefix}-title`}>
        2023年04月
        {/* {
          locale.Calendar.render
        } */}
      </div>
      <a
        className={classNames(
          `${classPrefix}-arrow-button`,
          `${classPrefix}-arrow-button-right`,
          `${classPrefix}-arrow-button-right-month`
        )}
        onClick={() => {
          console.log('3333333333333')
        }}
      >
        {props.nextMonthButton}
      </a>
      <a
        className={classNames(
          `${classPrefix}-arrow-button`,
          `${classPrefix}-arrow-button-right`,
          `${classPrefix}-arrow-button-right-year`
        )}
      >
        {props.nextYearButton}
      </a>
    </div>
  )

  return withNativeProps(props, <div className={classPrefix}>{header}</div>)
})

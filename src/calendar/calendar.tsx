import React, { ReactNode, forwardRef, useState } from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { convertValueToRange, DateRange, Page } from './convert'
import { NativeProps, withNativeProps } from '../utils/native-props'
import { ArrowLeft } from './arrow-left'
import { ArrowLeftDouble } from './arrow-left-double'
import { mergeProps } from '../utils/with-default-props'
import classNames from 'classnames'
import { usePropsValue } from '../utils/use-props-value'
import { useConfig } from '../config-provider'

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
  const { locale } = useConfig()
  const markItems = [...locale.Calendar.markItems]

  const [dateRange, setDateRange] = usePropsValue<DateRange>({
    value:
      props.value === undefined ? undefined : convertValueToRange(props.selectionMode, props.value),
    defaultValue: convertValueToRange(props.selectionMode, props.defaultValue),
    onChange: v => {
      if (props.selectionMode === 'single') {
        props.onChange?.(v ? v[0] : null)
      } else if (props.selectionMode === 'range') {
        props.onChange?.(v)
      }
    },
  })

  // dayjs().date(1) 返回当前时间所在月份的第一天，返回新的 Day.js 对象
  const [current, setCurrent] = useState(() => dayjs(dateRange ? dateRange[0] : today).date(1))

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
        {locale.Calendar.renderYearAndMonth(current.year(), current.month() + 1)}
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

  const mark = (
    <div className={`${classPrefix}-mark`}>
      {markItems.map((item, index) => (
        <div key={index} className={`${classPrefix}-mark-cell`}>
          {item}
        </div>
      ))}
    </div>
  )

  function renderCells() {
    const cells: ReactNode[] = []
    // .isoWeekday() 方法可以获取当前日期所在周的星期几，其中星期一为 1，星期二为 2，以此类推，星期日为 7。
    // .subtract(1, 'day') 的作用是将当前日期往前推移 1 天。作用：返回日历组件中第一天的 Day.js 对象。
    let iterator = current.subtract(current.isoWeekday(), 'day')

    // 日历组件第一天是星期一的情况
    if (props.weekStartsOn === 'Monday') {
      iterator = iterator.add(1, 'day')
    }

    while (cells.length < 6 * 7) {
      const d = iterator

      let isSelect = false
      let isBegin = false
      let isEnd = false

      if (dateRange) {
        const [begin, end] = dateRange
        isBegin = d.isSame(begin, 'day')
        isEnd = d.isSame(end, 'day')
        isSelect = isBegin || isEnd || (d.isAfter(begin, 'day') && d.isBefore(end, 'day'))
      }

      const isThisMonth = d.month() === current.month()

      cells.push(
        <div
          key={d.valueOf()}
          className={classNames(
            `${classPrefix}-cell`,
            !isThisMonth && `${classPrefix}-cell-disabled`,
            isThisMonth && {
              // isSame: 判断参数1日期，是否与参数2时间相同 （参数2： 传入 month 将会比较 month、year 是否相同。传入 day 将会比较 day、month、year 是否相同。 ）
              [`${classPrefix}-cell-today`]: d.isSame(today, 'day'),
              [`${classPrefix}-cell-selected`]: isSelect,
              [`${classPrefix}-cell-selected-begin`]: isBegin,
              [`${classPrefix}-cell-selected-end`]: isEnd,
            }
          )}
          onClick={() => {
            if (!props.selectionMode) return

            const date = d.toDate()

            // 点击其他月份区域将当前日期跳转至该月份
            if (!isThisMonth) {
              // clone() 创建一个表示当前时间的 Day.js 对象的副本，date(1) 将当前日期 current 设置为该月的第一天。
              setCurrent(d.clone().date(1))
            }

            /** 判断点击的是当前选中的时间 */
            function shouldClear() {
              if (!props.selectionMode) return false
              if (!dateRange) return false
              const [begin, end] = dateRange
              return d.isSame(begin, 'date') && d.isSame(end, 'day')
            }
            if (props.selectionMode === 'single') {
              // 点击当前选中的时间，则清除时间
              if (props.allowClear && shouldClear()) {
                setDateRange(null)
                return
              }
              setDateRange([date, date])
            }
          }}
        >
          <div className={`${classPrefix}-cell-top`}>
            {props.renderDate ? props.renderDate(d.toDate()) : d.date()}
          </div>
          <div className={`${classPrefix}-cell-bottom`}>{props.renderLabel?.(d.toDate())}</div>
        </div>
      )

      // 下一天
      iterator = iterator.add(1, 'day')
    }

    return cells
  }

  const body = <div className={`${classPrefix}-cells`}>{renderCells()}</div>

  return withNativeProps(
    props,
    <div className={classPrefix}>
      {header}
      {mark}
      {body}
    </div>
  )
})

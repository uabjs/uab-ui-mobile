import React, { ReactNode, forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { convertValueToRange, DateRange, Page, convertPageToDayjs } from './convert'
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
  // 判断日期是否可选
  shouldDisableDate?: (date: Date) => boolean
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
  jumpTo: (page: Page | ((page: Page) => Page)) => void
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
  if (props.weekStartsOn === 'Sunday') {
    const item = markItems.pop()
    if (item) {
      markItems.unshift(item)
    }
  }

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
  // 选中第一个时间后 intermediate = true
  const [intermediate, setIntermediate] = useState(false)

  useImperativeHandle(ref, () => ({
    jumpTo: pageOrPageGenerator => {
      let page: Page
      if (typeof pageOrPageGenerator === 'function') {
        page = pageOrPageGenerator({
          year: current.year(),
          month: current.month() + 1,
        })
      } else {
        page = pageOrPageGenerator
      }
      setCurrent(convertPageToDayjs(page))
    },
    jumpToToday: () => {
      setCurrent(dayjs().date(1))
    },
  }))

  const handlePageChange = (action: 'subtract' | 'add', num: number, type: 'month' | 'year') => {
    // dayjs().subtract(1, 'month') 日期时间第一天减去一个月
    const nxtCurrent = current[action](num, type)

    // 判断减去后时间是否小于最小时间，小于则 return
    if (action === 'subtract' && props.minPage) {
      const minPape = convertPageToDayjs(props.minPage)
      if (nxtCurrent.isBefore(minPape, type)) {
        return
      }
    }
    // 判断减去后时间是否大于最大时间，大于则 return
    if (action === 'add' && props.maxPage) {
      const maxPage = convertPageToDayjs(props.maxPage)
      if (nxtCurrent.isAfter(maxPage, type)) {
        return
      }
    }

    setCurrent(nxtCurrent)
  }

  const header = (
    <div className={`${classPrefix}-header`}>
      <a
        className={`${classPrefix}-arrow-button ${classPrefix}-arrow-button-year`}
        onClick={() => {
          handlePageChange('subtract', 1, 'year')
        }}
      >
        {props.prevYearButton}
      </a>
      <a
        className={`${classPrefix}-arrow-button ${classPrefix}-arrow-button-month`}
        onClick={() => {
          handlePageChange('subtract', 1, 'month')
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
          handlePageChange('add', 1, 'month')
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
        onClick={() => {
          handlePageChange('add', 1, 'year')
        }}
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

  const maxDay = useMemo(() => props.max && dayjs(props.max), [props.max])
  const minDay = useMemo(() => props.min && dayjs(props.min), [props.min])

  function renderCells() {
    const cells: ReactNode[] = []
    // .isoWeekday() 方法可以获取当前日期所在周的星期几，其中星期一为 1，星期二为 2，以此类推，星期日为 7。
    // .subtract(1, 'day') 的作用是将当前日期往前推移 1 天。作用：返回日历组件中第一天的 Day.js 对象。
    let iterator = current.subtract(current.isoWeekday(), 'day')

    // 日历组件第一天是星期一的情况
    if (props.weekStartsOn === 'Monday') {
      console.log('111111111')
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
      const disabled = props.shouldDisableDate
        ? props.shouldDisableDate(d.toDate())
        : (maxDay && d.isAfter(maxDay, 'day')) || (minDay && d.isBefore(minDay, 'day'))

      cells.push(
        <div
          key={d.valueOf()}
          className={classNames(
            `${classPrefix}-cell`,
            (disabled || !isThisMonth) && `${classPrefix}-cell-disabled`,
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
            } else if (props.selectionMode === 'range') {
              // 当前没有选中时间时走这里
              if (!dateRange) {
                setDateRange([date, date])
                setIntermediate(true)
                return
              }

              // 当前点击的时间是选中时间就清空时间
              if (shouldClear()) {
                setDateRange(null)
                setIntermediate(false)
                return
              }

              // 选择第二个时间时走这里
              if (intermediate) {
                const another = dateRange[0]
                setDateRange(another > date ? [date, another] : [another, date])
                setIntermediate(false)
              }
              // 选择第一个时间时走这里
              else {
                setDateRange([date, date])
                setIntermediate(true)
              }
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

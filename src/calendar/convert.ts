import dayjs from 'dayjs'

export type Page = {
  month: number
  year: number
}

export type DateRange = [Date, Date] | null

export function convertValueToRange(
  selectionMode: 'single' | 'range' | undefined,
  value: Date | [Date, Date] | null
): DateRange {
  if (selectionMode === undefined) {
    return null
  }

  if (value === null) {
    return null
  }

  if (Array.isArray(value)) {
    return value
  }

  return [value, value]
}

/** 传入年月转当月第一天，返回 dayjs 对象 */
export function convertPageToDayjs(page: Page) {
  return dayjs()
    .year(page.year)
    .month(page.month - 1)
    .date(1)
}

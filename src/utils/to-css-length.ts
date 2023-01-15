export function toCSSLength(val: number | string) {
  return typeof val === 'number' ? `${val}px` : val
}

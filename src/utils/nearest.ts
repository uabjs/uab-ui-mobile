/** 在参数1中找出最接近参数2的数 */
export function nearest(arr: number[], target: number) {
  return arr.reduce((pre, cur) => {
    return Math.abs(pre - target) < Math.abs(cur - target) ? pre : cur
  })
}

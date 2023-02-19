import { bound } from './bound'

/** 橡皮筋弹跳效果 （距离，缩放系数，常量） */
export function rubberband(distance: number, dimension: number, constant: number) {
  return (dimension * distance * constant) / (dimension + distance * constant)
}

/** 拖地图片超出范围时计算橡皮筋值 */
export function rubberbandIfOutOfBounds(
  position: number,
  min: number,
  max: number,
  dimension: number,
  constant = 0.15
) {
  if (constant === 0) {
    return bound(position, min, max)
  }
  if (position < min) {
    return -rubberband(min - position, dimension, constant) + min
  }
  if (position < max) {
    return +rubberband(position - max, dimension, constant) + max
  }

  return position
}

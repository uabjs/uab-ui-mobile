import React, { FC, MutableRefObject, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useSize } from 'ahooks'
import * as mat from '../utils/matrix'
import type { Matrix } from '../utils/matrix'
import { useDragAndPinch } from '../utils/use-drag-and-pinch'
import { bound } from '../utils/bound'

const classPrefix = `uabm-image-viewer`

type SlideProps = {
  image: string
  maxZoom: number | 'auto'
  onTap: () => void
  onZoomChange?: (zoom: number) => void
  dragLockRef?: MutableRefObject<boolean>
}

export const Slide: FC<SlideProps> = props => {
  const { dragLockRef, maxZoom } = props
  const pinchLockRef = useRef(false)
  const controlRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // matrix：根据目标位置计算得到的矩阵
  const [{ matrix }, api] = useSpring(() => ({
    matrix: mat.create(), // 初始矩阵 [1,0,0,1,0,0]
    config: { tension: 200 },
  }))

  // useSize: 监听 DOM 节点尺寸变化的 Hook。
  const controlSize = useSize(controlRef)
  const imgSize = useSize(imgRef)

  const boundMatrix = (nextMatrix: Matrix, type: 'translate' | 'scale', last = false): Matrix => {
    if (!controlSize || !imgSize) return nextMatrix

    const controlLeft = -controlSize.width / 2
    const controlTop = -controlSize.height / 2
    const imgLeft = -imgSize.width / 2
    const imgTop = -imgSize.height / 2

    const zoom = mat.getScaleX(nextMatrix)
    const scaledImgWidth = zoom * imgSize.width
    const scaledImgHeight = zoom * imgSize.height
    const [x, y] = mat.apply(nextMatrix, [imgLeft, imgTop])

    // if (type === 'translate') {
    //   let boundedX = x
    //   let boundedY = y
    //   if (scaledImgWidth > controlSize.width) {
    //     const minX = controlLeft - (scaledImgWidth - controlSize.width)

    //   }
    // }

    // 图片缩放结束后移动到居中位置
    if (type === 'scale' && last) {
      const [boundedX, boundedY] = [
        scaledImgWidth > controlSize.width
          ? bound(x, controlLeft - (scaledImgWidth - controlSize.width), controlLeft)
          : -scaledImgWidth / 2,
        scaledImgHeight > controlSize.height
          ? bound(y, controlTop - (scaledImgHeight - controlSize.height), controlTop)
          : -scaledImgHeight / 2,
      ]
      return mat.translate(nextMatrix, boundedX - x, boundedY - y)
    }

    return nextMatrix
  }

  // 文档：https://use-gesture.netlify.app/docs/gestures/#better-tree-shaking-with-createusegesture-and-creategesture
  useDragAndPinch(
    {
      // 处理拖动手势：拖拽时持续触发
      onDrag: state => {
        console.log('state===')
        // 第一次直接退出
        if (state.first) return
        if (state.pinching) return state.cancel()

        if (state.tap && state.elapsedTime > 0 && state.elapsedTime < 1000) {
          // 判断点击时间>0是为了过滤掉非正常操作，例如用户长按选择图片之后的取消操作（也是一次点击）
          // props.onTap()
          return
        }

        const currentZoom = mat.getScaleX(matrix.get())
        // if (dragLockRef) {
        //   dragLockRef.current = currentZoom !== 1
        // }
        // 图片缩放比例小于1时就重置矩阵
        if (!pinchLockRef.current && currentZoom <= 1) {
          console.log('图片缩放比例小于1时就重置矩阵====', matrix.get())
          api.start({
            matrix: mat.create(),
          })
        } else {
          const currentMatrix = matrix.get()
          console.log('currentMatrix====', currentMatrix)
          // const offset = [
          //   state.offset[0] - mat.getTranslateX(currentMatrix),
          //   state.offset[1] - mat.getTranslateY(currentMatrix),
          // ] as const

          // const nextMatrix = mat.translate(
          //   currentMatrix,
          //   // // 第直接退出
          //   ...(state.last ?)
          // )
        }
      },
      // 处理捏合手势：捏合时持续触发
      onPinch: state => {
        pinchLockRef.current = !state.last
        const [d] = state.offset
        if (d < 0) return

        // 计算最大缩放大小
        let mergedMaxZoom: number
        if (maxZoom === 'auto') {
          mergedMaxZoom =
            controlSize && imgSize
              ? Math.max(controlSize.height / imgSize.height, controlSize.width / imgSize.width)
              : 1
        } else {
          mergedMaxZoom = maxZoom
        }

        // 计算最终缩放大小
        const nextZoom = state.last ? bound(d, 1, mergedMaxZoom) : d
        props.onZoomChange?.(nextZoom)
        // 是最后一次捏合 并且 缩放小于等于1 就还原图片大小
        if (state.last && nextZoom <= 1) {
          api.start({
            matrix: mat.create(),
          })
          // if (dragLockRef) {
          //   dragLockRef.current = false
          // }
        } else {
          if (!controlSize) return

          const currentMatrix = matrix.get()
          const currentZoom = mat.getScaleX(currentMatrix)

          const originOffsetX = state.origin[0] - controlSize.width / 2
          const originOffsetY = state.origin[1] - controlSize.height / 2
          let nextMatrix = mat.translate(currentMatrix, -originOffsetX, -originOffsetY)
          nextMatrix = mat.scale(nextMatrix, nextZoom / currentZoom)
          nextMatrix = mat.translate(nextMatrix, originOffsetX, originOffsetY)

          console.log('222222222 ==', nextMatrix)
          api.start({
            matrix: boundMatrix(nextMatrix, 'scale', state.last),
            immediate: !state.last,
          })
        }
      },
    },
    {
      //监听的元素
      target: controlRef,
      // 拖动配置
      drag: {
        // 起始钩子：拖拽起始时触发一次，返回拖动起始[x, y]坐标
        from: () => [mat.getTranslateX(matrix.get()), mat.getTranslateY(matrix.get())],
        pointer: { touch: true }, // 滚动时仍保持拖动
      },
      // 捏合配置
      pinch: {
        // 起始钩子：捏合起始时触发一次，返回捏合起始[x, y]坐标
        from: () => [mat.getScaleX(matrix.get()), 0],
        pointer: { touch: true }, // 滚动时仍保持拖动
      },
    }
  )

  return (
    <div
      className={`${classPrefix}-slide`}
      // 监听鼠标移动
      onPointerMove={e => {
        // 获取当前计算后的矩阵x轴缩放比例，不等于1时停时事件冒泡
        if (mat.getScaleX(matrix.get()) !== 1) {
          e.stopPropagation()
        }
      }}
    >
      <div className={`${classPrefix}-control`} ref={controlRef}>
        <animated.div
          className={`${classPrefix}-image-wrapper`}
          style={{
            matrix,
          }}
        >
          <img ref={imgRef} src={props.image} alt={props.image} />
        </animated.div>
      </div>
    </div>
  )
}

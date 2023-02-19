import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react'

// https://use-gesture.netlify.app/docs/gestures/#better-tree-shaking-with-createusegesture-and-creategesture
export const useDragAndPinch = createUseGesture([dragAction, pinchAction])

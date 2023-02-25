import './steps.less'

import { Step } from './step'
import { Steps } from './steps'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { StepProps } from './step'
export type { StepsProps } from './steps'

export default attachPropertiesToComponent(Steps, {
  Step,
})

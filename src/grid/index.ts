import './grid.less'
import { Grid, GridItem } from './grid'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { GridProps, GridItemProps } from './grid'

export default attachPropertiesToComponent(Grid, { Item: GridItem })

import './list.less'

import { List } from './list'
import { ListItem } from './list-item'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { ListProps, ListRef } from './list'
export type { ListItemProps } from './list-item'

export default attachPropertiesToComponent(List, {
  Item: ListItem,
})

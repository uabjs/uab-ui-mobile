import './swiper.less'
import { Swiper } from './swiper'
import { SwiperItem } from './swiper-item'
import { attachPropertiesToComponent } from '../utils/attach-properties-to-component'

export type { SwiperProps, SwiperRef } from './swiper'

export default attachPropertiesToComponent(Swiper, {
  Item: SwiperItem,
})

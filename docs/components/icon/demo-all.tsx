import React, { useState, ComponentType } from 'react'
import { Grid } from 'uab-ui-mobile'
import * as Icons from 'antd-mobile-icons'
import { useLocale } from 'dumi'
import { useDebounceEffect } from 'ahooks'

import './demo-all.less'

const classPrefix = 'uabm-icon-doc'

const nameDicZh = {
  outline: '线框风格',
  fill: '实底风格',
  copyName: '复制名称',
  copyJSX: '复制JSX',
  searchPlaceholder: '搜索 Icon',
  copySucceeded: '复制成功',
}

const nameDicEn = {
  outline: 'Outlined',
  fill: 'Filled',
  copyName: 'Copy Name',
  copyJSX: 'Copy JSX',
  searchPlaceholder: 'Search Icon',
  copySucceeded: 'Copied Successfully',
}

type IconItem = {
  name: string
  component: ComponentType
}
const items: Record<'outline' | 'fill', IconItem[]> = {
  outline: [],
  fill: [],
}

// 将所有 icon 分类遍历到 items 内
for (let key in Icons) {
  const component = (Icons as any)[key] as ComponentType

  if (typeof component !== 'function') {
    continue
  }

  // 只有 outline，fill 两种 icon
  if (key.includes('Outline')) {
    items.outline.push({
      name: key,
      component,
    })
  } else {
    items.fill.push({
      name: key,
      component,
    })
  }
}

export default () => {
  const { id: locale } = useLocale()
  const nameDic = locale === 'zh' ? nameDicZh : nameDicEn
  const iconTypes = [
    {
      label: nameDic.outline,
      value: 'outline',
    },
    {
      label: nameDic.fill,
      value: 'fill',
    },
  ]

  const copyTypes = [
    {
      label: nameDic.copyName,
      value: 'name',
    },
    {
      label: nameDic.copyJSX,
      value: 'jsx',
    },
  ]

  const [displayedItems, setDisplayedItems] = useState<typeof items>(items)
  const [searchValue, setSearchValue] = useState<string>('')
  const [iconType, setIconType] = useState<string[]>(iconTypes.map(it => it.value)) // ['outline', 'fill']

  useDebounceEffect(
    () => {
      setDisplayedItems({
        outline: items.outline.filter(it =>
          it.name.toLowerCase().includes(searchValue.toLowerCase())
        ),
        fill: items.fill.filter(it => it.name.toLowerCase().includes(searchValue.toLowerCase())),
      })
    },
    [searchValue],
    {
      wait: 200,
      leading: false,
      trailing: true,
    }
  )

  // 通过屏幕宽度得到 icon 列数 4 ～ 8 列
  let gridColumns = Math.floor(window.innerWidth / 80)
  gridColumns = gridColumns > 8 ? 8 : gridColumns
  gridColumns = gridColumns < 4 ? 4 : gridColumns

  return (
    <div className={classPrefix}>
      {iconTypes.map(type => {
        const iconType_ = type.value as 'outline' | 'fill'
        if (iconType.includes(iconType_)) {
          return (
            <React.Fragment key={iconType_}>
              {displayedItems[iconType_].length > 0 && <h3>{nameDic[iconType_]}</h3>}
              <Grid columns={gridColumns}>
                {displayedItems[iconType_].map(item => (
                  <Grid.Item key={item.name} className={`${classPrefix}-item`}>
                    <div className={`${classPrefix}-icon`}>
                      <item.component />
                    </div>
                    <div className={`${classPrefix}-label`}>{item.name}</div>
                  </Grid.Item>
                ))}
              </Grid>
            </React.Fragment>
          )
        }
      })}
    </div>
  )
}

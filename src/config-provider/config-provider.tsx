import React, { FC, ReactNode, useContext } from 'react'
import { Locale } from '../locales/base'
import zhCN from '../locales/zh-CN'

type Config = {
  locale: Locale
  children?: ReactNode
}

export const defaultConfigRef: {
  current: Config
} = {
  current: {
    locale: zhCN,
  },
}

export function setDefaultConfig(config: Config) {
  defaultConfigRef.current = config
}

export function getDefaultConfig() {
  return defaultConfigRef.current
}

const ConfigContext = React.createContext<Config | null>(null)

export type ConfigProviderProps = Config

export const ConfigProvider: FC<ConfigProviderProps> = props => {
  const { children, ...config } = props
  const parentConfig = useConfig()
  console.log('1111====', props.locale)
  return (
    <ConfigContext.Provider
      value={{
        ...parentConfig,
        ...config,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext) ?? getDefaultConfig()
}
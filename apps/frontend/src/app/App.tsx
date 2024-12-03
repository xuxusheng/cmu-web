import { App as AntApp, ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { useSystemStore } from '../store/system.ts'
import styles from './App.module.scss'

export const App: FC = () => {
  const systemState = useSystemStore()

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          systemState.theme === 'light'
            ? theme.defaultAlgorithm
            : theme.darkAlgorithm,
        token: {
          colorPrimary: '#169e8c'
        }
      }}
    >
      <AntApp>
        <div className={styles.main}>
          <Outlet />
        </div>
      </AntApp>
    </ConfigProvider>
  )
}

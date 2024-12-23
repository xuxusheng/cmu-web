import { lazy } from '@loadable/component'
import { Suspense } from 'react'
import { Navigate, RouteObject } from 'react-router'

import { App } from '../app/App.tsx'
import { PageLoading } from '../component/page-loading'
import { LoginGuard } from '../guard/LoginGuard.tsx'
import { MainLayout } from '../layout/main-layout'
import { DataCollectionDebugPage } from '../page/data-access/data-collection-debug'
import { I2ConfigPage } from '../page/data-upload/i2-config'
import { I2DebugPage } from '../page/data-upload/i2-debug'
import { BackupFilePage } from '../page/system/backup-file'

const LoginPage = lazy(() => import('../page/login'))
const RealtimeStatusPage = lazy(() => import('../page/realtime-status'))
const RealtimeDataPage = lazy(() => import('../page/realtime-data'))
const HistoryDataPage = lazy(() => import('../page/history-data'))
const Iec61850Page = lazy(() => import('../page/data-upload/iec-61850'))

const MonitorDevicePage = lazy(
  () => import('../page/data-access/monitor-device')
)

const CommonSettingPage = lazy(() => import('../page/system/common-setting'))
const FileManagementPage = lazy(() => import('../page/system/file-management'))

const UserInfoPage = lazy(() => import('../page/user/user-info'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoading />}>
            <LoginPage />
          </Suspense>
        )
      },
      {
        path: 'main',
        element: (
          <LoginGuard>
            <MainLayout />
          </LoginGuard>
        ),
        children: [
          {
            path: 'home',
            element: <Navigate replace={true} to="/main/realtime-status" />
          },
          {
            // 实时状态
            path: 'realtime-status',
            element: (
              <Suspense fallback={<PageLoading />}>
                <RealtimeStatusPage />
              </Suspense>
            )
          },
          // 实时数据
          {
            path: 'realtime-data',
            element: (
              <Suspense fallback={<PageLoading />}>
                <RealtimeDataPage />
              </Suspense>
            )
          },
          {
            path: 'history',
            element: (
              <Suspense fallback={<PageLoading />}>
                <HistoryDataPage />
              </Suspense>
            )
          },
          // 南向设备
          {
            path: 'data-access',
            children: [
              {
                path: 'device',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <MonitorDevicePage />
                  </Suspense>
                )
              },
              {
                path: 'debug',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <DataCollectionDebugPage />
                  </Suspense>
                )
              },
              {
                path: '',
                element: <Navigate replace={true} to="./device" />
              }
            ]
          },
          // 北向应用
          {
            path: 'data-upload',
            children: [
              {
                // IEC61850配置
                path: 'iec61850',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <Iec61850Page />
                  </Suspense>
                )
              },
              {
                // I2配置
                path: 'i2-config',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <I2ConfigPage />
                  </Suspense>
                )
              },
              {
                // I2 调试
                path: 'i2-debug',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <I2DebugPage />
                  </Suspense>
                )
              },
              {
                path: '',
                element: <Navigate replace={true} to="./iec61850" />
              }
            ]
          },

          {
            path: 'system',
            children: [
              {
                path: 'common-setting',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <CommonSettingPage />
                  </Suspense>
                )
              },
              {
                path: 'file-management',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <FileManagementPage />
                  </Suspense>
                )
              },
              {
                path: 'backup-file',
                element: (
                  <Suspense fallback={<PageLoading />}>
                    <BackupFilePage />
                  </Suspense>
                )
              },
              {
                path: '',
                element: <Navigate replace={true} to="./common-setting" />
              }
            ]
          },
          {
            path: 'user-info',
            element: (
              <Suspense fallback={<PageLoading />}>
                <UserInfoPage />
              </Suspense>
            )
          }
        ]
      },
      {
        path: '',
        element: <Navigate replace={true} to="/main/realtime-status" />
      }
    ]
  }
]

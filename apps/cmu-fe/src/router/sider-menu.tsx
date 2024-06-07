import {
  ApiOutlined,
  CloudUploadOutlined,
  FundProjectionScreenOutlined,
  HistoryOutlined,
  SettingOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { ProLayoutProps } from '@ant-design/pro-components'

// 网页侧边栏菜单
export const siderMenu: ProLayoutProps['route'] = {
  path: '/',
  routes: [
    // {
    //   path: '/main/home',
    //   name: '总览',
    //   icon: <HomeOutlined />
    // },
    {
      path: '/main/realtime-status',
      name: '总览',
      icon: <ThunderboltOutlined />
    },
    {
      name: '实时数据',
      path: '/main/realtime-data',
      icon: <FundProjectionScreenOutlined />
    },
    {
      name: '历史数据',
      path: '/main/history',
      icon: <HistoryOutlined />
    },
    {
      name: '南向设备',
      // 南向设备，不要只用 data
      path: '/main/data-access',
      icon: <ApiOutlined />,
      routes: [
        {
          name: '监测设备管理',
          path: '/main/data-access/device'
        },
        {
          name: '采集程序调试',
          path: '/main/data-access/debug'
        }
      ]
    },
    // 北向应用
    {
      name: '北向应用',
      path: '/main/data-upload',
      icon: <CloudUploadOutlined />,
      routes: [
        {
          name: 'IEC 61850 配置',
          path: '/main/data-upload/iec61850'
        },
        {
          name: 'I2 配置',
          path: '/main/data-upload/i2-config'
        },
        {
          name: 'I2 调试',
          path: '/main/data-upload/i2-debug'
        }
      ]
    },
    {
      name: '系统设置',
      path: '/main/system',
      icon: <SettingOutlined />,
      routes: [
        {
          name: '通用设置',
          path: '/main/system/common-setting'
        },
        {
          name: '文件管理',
          path: '/main/system/file-management'
        }
      ]
    }
  ]
}

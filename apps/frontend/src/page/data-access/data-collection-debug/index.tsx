// 采集程序调试页面
import { HomeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Space } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router'

import { CollectConfigCard } from './CollectConfigCard.tsx'
import { LogCard } from './LogCard.tsx'

export const DataCollectionDebugPage: FC = () => {
  const navigate = useNavigate()

  return (
    <PageContainer
      breadcrumb={{
        items: [
          {
            path: '',
            title: <HomeOutlined />,
            onClick: () => navigate('/main/realtime-status')
          },
          { title: '南向设备' },
          { title: '采集程序调试' }
        ]
      }}
      title={false}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <CollectConfigCard />

        <LogCard />
      </Space>
    </PageContainer>
  )
}

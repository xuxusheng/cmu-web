import { HomeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Space } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router'

import { CacConfigCard } from './CacConfigCard.tsx'
import { CagConfigCard } from './CagConfigCard.tsx'
import { I2SensorCard } from './I2SensorCard.tsx'

export const I2ConfigPage: FC = () => {
  const navigate = useNavigate()

  return (
    <PageContainer
      breadcrumb={{
        items: [
          {
            path: '/',
            title: <HomeOutlined />,
            onClick: () => navigate('/')
          },
          { title: '北向应用' },
          { title: 'I2 配置' }
        ]
      }}
      title={false}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <CacConfigCard />

        <CagConfigCard />

        <I2SensorCard />
      </Space>
    </PageContainer>
  )
}

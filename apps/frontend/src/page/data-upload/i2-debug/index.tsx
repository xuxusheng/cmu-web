import { HomeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Space } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { I2LogCard } from './I2LogCard.tsx'

export const I2DebugPage: FC = () => {
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
          { title: 'I2 调试' }
        ]
      }}
      title={false}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <I2LogCard />
      </Space>
    </PageContainer>
  )
}

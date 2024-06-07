import { HomeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Space } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogConfigCard } from './LogConfigCard.tsx'
import { MmsConfigCard } from './MmsConfigCard.tsx'

const Iec61850Page: FC = () => {
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
          { title: 'IEC 61850 配置' }
        ]
      }}
      title={false}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <MmsConfigCard />
        <LogConfigCard />
      </Space>
    </PageContainer>
  )
}

export default Iec61850Page

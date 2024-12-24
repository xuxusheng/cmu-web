import { HomeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { Col, Row } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router'

import { IedRegisterCard } from './components/IedRegisterCard.tsx'
import { NetworkCard } from './components/NetworkCard.tsx'
import { NtpConfigCard } from './components/NtpConfigCard.tsx'
import { ProcessStatusCard } from './components/ProcessStatusCard.tsx'
import { SystemStatusCard } from './components/SystemStatusCard.tsx'
import { SystemTimeCard } from './components/SystemTimeCard.tsx'

const CommonSettingPage: FC = () => {
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
          { title: '系统设置' },
          { title: '通用设置' }
        ]
      }}
      title={false}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SystemStatusCard />
        </Col>

        <Col xl={{ span: 24 }} xxl={{ span: 12 }}>
          <SystemTimeCard />
        </Col>
        <Col xl={{ span: 24 }} xxl={{ span: 12 }}>
          <NtpConfigCard />
        </Col>
        <Col span={24}>
          <IedRegisterCard />
        </Col>
        <Col span={24}>
          <NetworkCard />
        </Col>
        <Col span={24}>
          <ProcessStatusCard />
        </Col>
      </Row>
    </PageContainer>
  )
}

export default CommonSettingPage

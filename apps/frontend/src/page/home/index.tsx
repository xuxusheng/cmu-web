import { PageContainer } from '@ant-design/pro-components'

import { Space } from 'antd'
import { FC } from 'react'
import { SystemStatusCard } from '../system/common-setting/components/SystemStatusCard.tsx'
import { SensorsStatusCard } from './SensorsStatusCard.tsx'

export const HomePage: FC = () => {
  return (
    <div>
      <PageContainer>
        <Space direction="vertical" style={{ width: '100%' }}>
          <SensorsStatusCard />

          <SystemStatusCard />
        </Space>
      </PageContainer>
    </div>
  )
}

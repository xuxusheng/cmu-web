import { HomeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConfigFileTable } from './ConfigFileTable.tsx'
import { IcdFileTable } from './IcdFileTable.tsx'
import styles from './index.module.scss'
import { LogFileTable } from './LogFileTable.tsx'
enum Tabs {
  Log = 'log',
  Config = 'config',
  Icd = 'icd'
}

const FileManagementPage: FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Log)

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
          { title: '文件管理' }
        ]
      }}
      className={styles.main}
      tabActiveKey={activeTab}
      tabList={[
        {
          tab: '日志文件',
          key: Tabs.Log
        },
        {
          tab: '配置文件',
          key: Tabs.Config
        },
        {
          tab: 'ICD 文件',
          key: Tabs.Icd
        }
      ]}
      title={false}
      onTabChange={(key) => setActiveTab(key as Tabs)}
    >
      {activeTab === Tabs.Log && <LogFileTable />}
      {activeTab === Tabs.Config && <ConfigFileTable />}
      {activeTab === Tabs.Icd && <IcdFileTable />}
    </PageContainer>
  )
}

export default FileManagementPage

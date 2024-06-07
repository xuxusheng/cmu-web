import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable
} from '@ant-design/pro-components'
import { Badge, Typography } from 'antd'
import { FC, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterval } from 'react-use'
import { sensorApi } from '../../api/sensor.ts'
import { SensorStatus } from '../../interface/sensor.ts'
import styles from './index.module.scss'

const RealtimeStatusPage: FC = () => {
  const navigate = useNavigate()

  // ------------------------------------ State ------------------------------------
  const actionRef = useRef<ActionType>()

  // ------------------------------------ React-Query ------------------------------------

  // ------------------------------------ UseEffect ------------------------------------
  useInterval(
    () => actionRef.current?.reload(),
    1000 * 10 // 定时刷新
  )

  // ------------------------------------ UseCallback ------------------------------------
  const getStatus = useCallback((n: number) => {
    if (n === 0) {
      return 'success'
    }
    if (n === 1) {
      return 'warning'
    }
    if (n === 2) {
      return 'error'
    }
    return 'default'
  }, [])

  // ------------------------------------ Method ------------------------------------
  // 跳转到实时数据页面
  const goToRealtimeData = (sensorId: number) => {
    navigate(`/main/realtime-data?sensorId=${sensorId}`)
  }

  // ------------------------------------ Render ------------------------------------

  const columns: ProColumns<SensorStatus>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48
    },
    {
      title: '设备描述',
      dataIndex: 'sensorDescCn',
      key: 'sensorDescCn',
      render: (_, entity) => (
        <Typography.Link onClick={() => goToRealtimeData(entity.sensorId)}>
          {entity.sensorDescCn}
        </Typography.Link>
      )
    },
    {
      title: '通信状态',
      dataIndex: 'movDevConf',
      render: (_, entity) => (
        <Badge
          className={styles.statusBadge}
          status={getStatus(entity.movDevConf)}
        />
      )
    },
    {
      title: '运行状态',
      dataIndex: 'supDevRun',
      render: (_, entity) => (
        <Badge
          className={styles.statusBadge}
          status={getStatus(entity.supDevRun)}
        />
      )
    },
    {
      title: '数据状态',
      dataIndex: 'dataStatus',
      render: (_, entity) => (
        <Badge
          className={styles.statusBadge}
          status={getStatus(entity.dataStatus)}
        />
      )
    },
    {
      title: '时间',
      dataIndex: 'dataTime',
      width: 160
    }
  ]

  return (
    <PageContainer
      className={styles.main}
      pageHeaderRender={() => null}
      title={false}
    >
      <ProTable<SensorStatus>
        actionRef={actionRef}
        columns={columns}
        defaultSize="small"
        headerTitle={'设备实时状态'}
        options={{
          fullScreen: true
        }}
        pagination={false}
        request={async () => {
          const res = await sensorApi.getAllSensorStatus()
          const data = res.data.data || []
          return {
            data,
            success: true
          }
        }}
        rowKey={(record) => record.id}
        scroll={{
          x: 'max-content'
        }}
        search={false}
      />
    </PageContainer>
  )
}

export default RealtimeStatusPage

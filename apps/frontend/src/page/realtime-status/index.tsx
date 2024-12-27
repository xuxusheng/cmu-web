import {
  ActionType,
  LightFilter,
  PageContainer,
  ProColumns,
  ProFormSwitch,
  ProTable
} from '@ant-design/pro-components'
import { Badge, Typography } from 'antd'
import { FC, useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useInterval } from 'react-use'

import { sensorApi } from '../../api/sensor.ts'
import { SensorStatus } from '../../interface/sensor.ts'
import styles from './index.module.scss'

const RealtimeStatusPage: FC = () => {
  const navigate = useNavigate()

  // ------------------------------------ State ------------------------------------
  const actionRef = useRef<ActionType>()
  const [onlyOnline, setOnlyOnline] = useState(true)
  const [keyword, setKeyword] = useState('')

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
      title: '短地址',
      dataIndex: 'sAddr',
      key: 'sAddr'
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
        request={async (params, sort, filter) => {
          console.log('表格查询参数：', params, sort, filter)
          const res = await sensorApi.getAllSensorStatus()
          let data = res.data.data || []

          if (onlyOnline) {
            data = data.filter((item) => !!item.id)
          }

          if (keyword) {
            data = data.filter((item) => item.sensorDescCn.includes(keyword))
          }

          return {
            data,
            success: true
          }
        }}
        pagination={{
          showQuickJumper: true,
          pageSizeOptions: [10, 20, 50, 100, 200],
          defaultPageSize: 100
        }}
        toolbar={{
          search: {
            placeholder: '请输入设备描述/短地址',
            onSearch: (value) => {
              setKeyword(value)
              actionRef.current?.reload()
            }
          },
          filter: (
            <LightFilter<{
              onlyOnline: boolean
            }>
              initialValues={{
                onlyOnline: true
              }}
              onFinish={async (values) => {
                console.log('轻量查询参数：', values)
                setOnlyOnline(values.onlyOnline)
                actionRef.current?.reload()
              }}
            >
              <ProFormSwitch
                fieldProps={{
                  autoFocus: false
                }}
                name="onlyOnline"
                label="仅显示在线设备"
              />
            </LightFilter>
          )
        }}
        rowKey={(record) => record.sensorId}
        scroll={{
          x: 'max-content'
        }}
        search={false}
      />
    </PageContainer>
  )
}

export default RealtimeStatusPage

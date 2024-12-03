import {
  FundProjectionScreenOutlined,
  HomeOutlined,
  WarningOutlined
} from '@ant-design/icons'
import {
  PageContainer,
  ProCard,
  ProDescriptions
} from '@ant-design/pro-components'
import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button, Empty, Space, Spin, Tooltip, Typography } from 'antd'
import { clsx } from 'clsx'
import dayjs from 'dayjs'
import { FC, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { QueryKey } from '../../api/query-key.ts'
import { sensorApi } from '../../api/sensor.ts'
import styles from './index.module.scss'
import { SensorStatusPoint } from './SensorStatusPoint.tsx'

const RealtimeDataPage: FC = () => {
  const navigate = useNavigate()
  // const [animateParent] = useAutoAnimate()
  const [searchParams, setSearchParams] = useSearchParams()

  const parentRef = useRef<HTMLDivElement>(null)

  // ----------------------------- React-Query -----------------------------
  const allSensorLatestDataQuery = useQuery({
    queryKey: [QueryKey.AllSensorLatestData],
    queryFn: () => sensorApi.getAllLatestReportData(),
    refetchInterval: 1000 * 10,
    gcTime: 1000 * 60 // 一分钟内乐观更新
  })
  const allSensorStatusQuery = useQuery({
    queryKey: [QueryKey.AllSensorsStatus],
    queryFn: () => sensorApi.getAllSensorStatus(),
    refetchInterval: 1000 * 10,
    gcTime: 1000 * 60 // 一分钟内乐观更新
  })

  const loading =
    allSensorLatestDataQuery.isLoading || allSensorStatusQuery.isLoading

  // ----------------------------- Memo -----------------------------
  const allSensorLatestData = useMemo(
    () => allSensorLatestDataQuery.data?.data.data || [],
    [allSensorLatestDataQuery.data]
  )

  const allSensorStatus = useMemo(
    () => allSensorStatusQuery.data?.data.data || [],
    [allSensorStatusQuery.data]
  )

  const virtualizer = useVirtualizer({
    count: allSensorLatestData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45
  })

  const items = virtualizer.getVirtualItems()

  // ----------------------------- UseEffect -----------------------------
  // 当 url 中存在 sensorId 参数时，跳转到对应的传感器卡片
  useEffect(() => {
    const sensorId = searchParams.get('sensorId')
    if (
      allSensorLatestData.length === 0 ||
      !sensorId ||
      !allSensorLatestData.find((v) => v.id === Number(sensorId))
    ) {
      return
    }

    setSearchParams({ sensorId: '' }, { replace: true })

    // 查询出是第几个元素
    const index = allSensorLatestData.findIndex(
      (v) => v.id === Number(sensorId)
    )

    if (index === -1) {
      return
    }

    setTimeout(() => {
      virtualizer.scrollToIndex(index, {
        align: 'start'
      })
    }, 0)

    setTimeout(() => {
      const sensorElement = document.querySelector(`#sensor-${sensorId}`)
      if (sensorElement) {
        sensorElement.classList.add('animate__animated', 'animate__headShake')
      }
    }, 500)
  }, [allSensorLatestData, searchParams, setSearchParams, virtualizer])

  // ----------------------------- Method -----------------------------
  // 跳转到历史记录页面
  const goToHistoryData = (sensorId: number) => {
    navigate(`/main/history?sensorId=${sensorId}`)
  }

  // 判断是否一天未上传数据了
  const isOneDayNoReport = (datetime: string) => {
    if (!datetime) {
      return false
    }
    return dayjs(datetime).isBefore(dayjs().subtract(24, 'hour'))
  }

  // ----------------------------- Render -----------------------------

  const renderCardTitle = (sensor: (typeof allSensorLatestData)[0]) => (
    <Space align="center" size="small" wrap={true}>
      <span>
        {isOneDayNoReport(sensor.latestReportTime) && (
          <Tooltip title="该设备 24 小时内未上报数据">
            <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
          </Tooltip>
        )}

        {sensor.descCn}
      </span>
      <div style={{ marginTop: -1 }}>
        <SensorStatusPoint
          sensorStatus={allSensorStatus.find((v) => v.sensorId === sensor.id)}
        />
      </div>
    </Space>
  )

  const renderCardExtra = (sensor: (typeof allSensorLatestData)[0]) => (
    <Space wrap={true}>
      <Typography.Text style={{ display: 'inline' }} type="secondary">
        {sensor.latestReportTime}
      </Typography.Text>
      <Tooltip mouseEnterDelay={0.5} title="查看设备历史数据">
        <Button
          size="small"
          type="text"
          onClick={() => goToHistoryData(sensor.id)}
        >
          <FundProjectionScreenOutlined />
        </Button>
      </Tooltip>
    </Space>
  )

  const renderCard = (sensor: (typeof allSensorLatestData)[0]) => {
    return (
      <ProCard
        className={clsx({
          [styles.warning]: isOneDayNoReport(sensor.latestReportTime)
        })}
        extra={renderCardExtra(sensor)}
        id={`sensor-${sensor.id}`}
        style={{ marginBottom: 16, minWidth: 400 }}
        title={renderCardTitle(sensor)}
      >
        {sensor.latestReportData.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : null}

        <ProDescriptions size="small">
          {sensor.latestReportData
            .filter((v) => v.importLevel >= 1)
            .map(({ label, key, value, unit }) => {
              return (
                <ProDescriptions.Item key={key} label={label}>
                  <Typography.Text>
                    {value}
                    {unit && <span>&nbsp;{unit}</span>}
                  </Typography.Text>
                </ProDescriptions.Item>
              )
            })}
        </ProDescriptions>
      </ProCard>
    )
  }

  if (loading || !allSensorLatestData.length) {
    return (
      <Spin spinning={loading}>
        <Empty style={{ padding: '20vh 0' }} />
      </Spin>
    )
  }

  return (
    <PageContainer
      breadcrumb={{
        items: [
          {
            path: '',
            title: <HomeOutlined />,
            onClick: () => navigate('/main/realtime-status')
          },
          { title: '实时数据' }
        ]
      }}
      childrenContentStyle={{
        paddingRight: 0,
        paddingBottom: 0
      }}
      className={styles.main}
      title={false}
    >
      <Spin spinning={allSensorLatestDataQuery.isFetching}>
        <div
          ref={parentRef}
          style={{
            height: 'calc(100vh - 120px)',
            paddingRight: 16,
            overflowY: 'auto',
            contain: 'strict'
          }}
        >
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: '100%',
              position: 'relative'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${items[0]?.start ?? 0}px)`
              }}
            >
              {items.map((virtualRow) => (
                <div
                  data-index={virtualRow.index}
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                >
                  {renderCard(allSensorLatestData[virtualRow.index])}
                </div>
              ))}
            </div>
          </div>
        </div>{' '}
      </Spin>
    </PageContainer>
  )
}

export default RealtimeDataPage

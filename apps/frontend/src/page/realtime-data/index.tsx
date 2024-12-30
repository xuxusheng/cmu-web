import {
  FundProjectionScreenOutlined,
  HomeOutlined,
  SearchOutlined,
  WarningOutlined
} from '@ant-design/icons'
import {
  PageContainer,
  ProCard,
  ProDescriptions
} from '@ant-design/pro-components'
import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Button,
  Col,
  Empty,
  Flex,
  Input,
  Row,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { clsx } from 'clsx'
import dayjs from 'dayjs'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useNavigate, useSearchParams } from 'react-router'

import { QueryKey } from '../../api/query-key.ts'
import { sensorApi } from '../../api/sensor.ts'
import styles from './index.module.scss'
import { SensorStatusPoint } from './SensorStatusPoint.tsx'

const RealtimeDataPage: FC = () => {
  const navigate = useNavigate()
  // const [animateParent] = useAutoAnimate()
  const [searchParams, setSearchParams] = useSearchParams()
  // 选中的描述前缀
  const [selectedDescPrefixes, setSelectedDescPrefixes] = useState<string[]>([])

  const parentRef = useRef<HTMLDivElement>(null)

  // ------------------------------ State -----------------------------
  const [keyword, setKeyword] = useState('')

  // ----------------------------- React-Query -----------------------------
  const sensorDescPrefixOptionsQuery = useQuery({
    queryKey: [QueryKey.SensorDescPrefixOptions],
    queryFn: sensorApi.getDescPrefixOptions,
    gcTime: 1000 * 60 * 60 * 24 // 这个数据一般不会更改，直接缓存一天
  })

  const allSensorLatestDataQuery = useQuery({
    queryKey: [QueryKey.AllSensorLatestData, selectedDescPrefixes],
    queryFn: () =>
      sensorApi.getAllLatestReportData({
        descPrefixes: selectedDescPrefixes
      }),
    refetchInterval: 1000 * 10,
    gcTime: 1000 * 60 // 一分钟内乐观更新
  })
  const allSensorStatusQuery = useQuery({
    queryKey: [QueryKey.AllSensorsStatus],
    queryFn: () => sensorApi.getAllSensorStatus(),
    refetchInterval: 1000 * 10,
    gcTime: 1000 * 60 // 一分钟内乐观更新
  })

  // const loading =
  //   allSensorLatestDataQuery.isLoading ||
  //   allSensorStatusQuery.isLoading ||
  //   sensorDescPrefixOptionsQuery.isLoading

  // ----------------------------- Memo -----------------------------
  const sensorDescPrefixOptions = useMemo(
    () => sensorDescPrefixOptionsQuery.data?.data.data || [],
    [sensorDescPrefixOptionsQuery.data]
  )
  const allSensorLatestData = useMemo(() => {
    const data = allSensorLatestDataQuery.data?.data.data || []

    if (!data.length) {
      return []
    }

    if (keyword) {
      return data.filter((v) => v.descCn.includes(keyword))
    }

    return data
  }, [allSensorLatestDataQuery.data, keyword])

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

  // 设置关键词（防抖）
  const setKeywordDebounce = useMemo(() => {
    let timer: NodeJS.Timeout | null = null
    return (keyword: string) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        setKeyword(keyword)
      }, 300)
    }
  }, [])

  // ----------------------------- Render -----------------------------

  const renderSensorPrefixOptions = () => {
    return (
      <Flex
        wrap={true}
        gap={8}
        style={{
          maxHeight: 'calc(100vh - 142px)',
          overflowY: 'auto',
          marginRight: 16
        }}
      >
        {sensorDescPrefixOptions.map((prefix) => (
          <Tag.CheckableTag
            key={prefix}
            checked={selectedDescPrefixes.includes(prefix)}
            onChange={(checked) => {
              if (checked) {
                setSelectedDescPrefixes([...selectedDescPrefixes, prefix])
              } else {
                setSelectedDescPrefixes(
                  selectedDescPrefixes.filter((v) => v !== prefix)
                )
              }
            }}
          >
            {prefix}
          </Tag.CheckableTag>
        ))}
      </Flex>
    )
  }

  const renderSensorCardTitle = (sensor: (typeof allSensorLatestData)[0]) => (
    <Space align="center" size="small" wrap={true}>
      <span>
        {isOneDayNoReport(sensor.latestReportTime) && (
          <Tooltip title="该设备 24 小时内未上报数据">
            <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
          </Tooltip>
        )}

        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[keyword]}
          autoEscape
          textToHighlight={sensor.descCn}
        />
      </span>
      <div style={{ marginTop: -1 }}>
        <SensorStatusPoint
          sensorStatus={allSensorStatus.find((v) => v.sensorId === sensor.id)}
        />
      </div>
    </Space>
  )

  const renderSensorCardExtra = (sensor: (typeof allSensorLatestData)[0]) => (
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

  const renderSensorCard = (sensor: (typeof allSensorLatestData)[0]) => {
    return (
      <ProCard
        className={clsx({
          [styles.warning]: isOneDayNoReport(sensor.latestReportTime)
        })}
        extra={renderSensorCardExtra(sensor)}
        id={`sensor-${sensor.id}`}
        style={{ marginBottom: 16, minWidth: 400 }}
        title={renderSensorCardTitle(sensor)}
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

  // if (loading || !allSensorLatestData.length) {
  //   return (
  //     <Spin spinning={loading}>
  //       <Empty style={{ padding: '20vh 0' }} />
  //     </Spin>
  //   )
  // }

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
      <Row gutter={0}>
        <Col flex="160px">{renderSensorPrefixOptions()}</Col>
        <Col flex="auto">
          <div
            style={{
              marginBottom: 16,
              paddingRight: 24
            }}
          >
            <Input
              allowClear
              suffix={<SearchOutlined />}
              size="large"
              placeholder="请输入设备描述"
              onChange={(e) => {
                setKeywordDebounce(e.target.value)
              }}
            />
          </div>
          <Spin spinning={allSensorLatestDataQuery.isFetching}>
            {allSensorLatestData.length ? (
              <div
                ref={parentRef}
                style={{
                  height: 'calc(100vh - 200px)',
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
                        {renderSensorCard(
                          allSensorLatestData[virtualRow.index]
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Empty style={{ marginTop: 120 }} />
            )}
          </Spin>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default RealtimeDataPage

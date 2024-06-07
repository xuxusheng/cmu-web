import { HomeOutlined } from '@ant-design/icons'
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormCascader,
  ProFormDateRangePicker,
  ProTable,
  QueryFilter
} from '@ant-design/pro-components'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Space, message } from 'antd'
import dayjs from 'dayjs'
import { camelCase, groupBy, isEqual, isNil, last, omitBy } from 'lodash-es'
import { FC, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QueryKey } from '../../api/query-key.ts'
import { sensorApi } from '../../api/sensor.ts'
import { SensorReportData } from '../../interface/sensor.ts'
import { DataTrend } from './DataTrend.tsx'

enum Tabs {
  // 趋势图
  Trend = 'trend',

  // 数据详情
  Detail = 'detail'
}

interface FormState {
  sensorId?: number
  reportTimeRange?: [string, string]
}

const HistoryDataPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const actionRef = useRef<ActionType>()

  const [query, setQuery] = useState<{
    sensorId?: number
    reportTimeRange?: [string, string]
  }>({
    sensorId: Number(searchParams.get('sensorId')),
    reportTimeRange: [
      // 最近七天
      dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD')
    ]
  })

  // ----------------------------- React-Query -----------------------------
  // 传感器列表查询
  const sensorsQuery = useQuery({
    queryKey: [QueryKey.Sensors],
    queryFn: () => sensorApi.list()
  })

  // 传感器上报数据
  const sensorReportDataQuery = useQuery({
    queryKey: [QueryKey.SensorReportData, query],
    queryFn: () =>
      sensorApi.getReportData({
        id: query.sensorId!,
        reportTimeRange: query.reportTimeRange
      }),
    enabled: !!query.sensorId,
    gcTime: 1000 * 60 * 10 // 10min 内乐观更新
    // todo keepPreviousData
    // keepPreviousData: !!query.sensorId,
  })
  // 传感器上报数据包含的字段信息
  const sensorReportDataFieldQuery = useQuery({
    queryKey: [QueryKey.SensorReportDataFieldBySensorId, query.sensorId],
    queryFn: () => sensorApi.getReportDataFields(query.sensorId!),
    enabled: !!query.sensorId,
    gcTime: 1000 * 60 * 60 * 24 // 这个数据一般不会更改，直接缓存一天
    // todo keepPreviousData
    // keepPreviousData: !!query.sensorId,
  })

  // ----------------------------- UseMemo -----------------------------
  const loading =
    sensorReportDataQuery.isLoading || sensorReportDataQuery.isPlaceholderData
  const sensors = sensorsQuery.data?.data.data || []
  const sensorOptions = useMemo(() => {
    if (!sensors.length) {
      return []
    }

    // 通过设备类型聚合
    const groupByLnClass = groupBy(sensors, 'lnClassNameCn')

    return Object.entries(groupByLnClass).map(([lnClassNameCn, sensors]) => {
      return {
        label: lnClassNameCn,
        value: lnClassNameCn,
        children: sensors.map((sensor) => ({
          label: `${sensor.descCn}（${sensor.sensorTypeNameCn}）`,
          value: sensor.id
        }))
      }

      // 再通过设备型号聚合
      // const groupBySensorType = groupBy(sensors, 'sensorTypeNameCn')

      // return {
      //   label: lnClassNameCn,
      //   value: lnClassNameCn,
      //   children: Object.entries(groupBySensorType).map(
      //     ([sensorTypeNameCn, sensors]) => ({
      //       label: sensorTypeNameCn,
      //       value: sensorTypeNameCn,
      //       children: sensors.map((sensor) => ({
      //         label: sensor.descCn,
      //         value: sensor.id,
      //         key: sensor.id
      //       }))
      //     })
      //   )
      // }
    })
  }, [sensors])

  const sensorReportData = useMemo(
    () => sensorReportDataQuery.data?.data.data || [],
    [sensorReportDataQuery.data]
  )

  const sensorReportDataField = useMemo(
    () => sensorReportDataFieldQuery.data?.data.data || [],
    [sensorReportDataFieldQuery.data]
  )

  // ----------------------------- Method -----------------------------

  // 导出
  const handleExport = () => {
    if (!query.sensorId) {
      return
    }

    sensorApi.exportReportData(query.sensorId)
  }

  const handleSearch = async (values: FormState) => {
    const { sensorId, reportTimeRange } = values

    if (!!sensorId && isEqual(omitBy(query, isNil), omitBy(values, isNil))) {
      // 将页码返回第一页
      actionRef.current?.setPageInfo?.({
        current: 1
      })
      queryClient.removeQueries({
        queryKey: [QueryKey.SensorReportData, query]
      })
      sensorReportDataQuery.refetch()
      return
    }

    if (!sensorId) {
      message.info('请先选择设备')
    }

    setQuery({
      sensorId,
      reportTimeRange
    })
  }

  // ----------------------------- Render -----------------------------
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const columns = useMemo<ProColumns<SensorReportData>[]>(() => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        width: 64,
        fixed: 'left'
      },
      {
        title: '上报时间',
        dataIndex: 'reportTime',
        key: 'reportTime',
        width: 168,
        fixed: 'left'
      }
    ].concat(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sensorReportDataField
        .filter(({ importLevel }) => importLevel === 2)
        .map((field) => ({
          title: field.label,
          dataIndex: camelCase(field.key),
          key: camelCase(field.key),
          width: Math.max(field.label.length * 22, 80),
          renderText: (text: string | number) =>
            field.unit ? `${text} ${field.unit}` : text
        }))
    )
  }, [sensorReportDataField])

  return (
    <PageContainer
      breadcrumb={{
        items: [
          {
            path: '',
            title: <HomeOutlined />,
            onClick: () => navigate('/main/realtime-status')
          },
          { title: '历史数据' }
        ]
      }}
      title={false}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <ProCard bodyStyle={{ padding: 0 }} size="small">
          <QueryFilter<FormState>
            initialValues={{ ...query }}
            onFinish={handleSearch}
          >
            <ProFormCascader
              fieldProps={{
                options: sensorOptions,
                showSearch: true,
                expandTrigger: 'hover',
                displayRender: (labels) => {
                  const sensorId = Number(last(labels))

                  const sensor = sensors.find(
                    (sensor) => sensor.id === sensorId
                  )
                  return sensor?.descCn
                }
              }}
              getValueFromEvent={(value) => value && last(value)}
              label="设备"
              name="sensorId"
              placeholder="请选择设备"
            />

            <ProFormDateRangePicker label="上报时间" name="reportTimeRange" />
          </QueryFilter>
        </ProCard>

        <ProCard
          size="small"
          tabs={{
            items: [
              {
                label: '数据详情',
                key: Tabs.Detail,
                children: (
                  <ProTable<SensorReportData>
                    actionRef={actionRef}
                    columns={columns}
                    dataSource={sensorReportData}
                    defaultSize="small"
                    loading={loading || sensorReportDataFieldQuery.isLoading}
                    options={{
                      fullScreen: true,
                      reload: () => {
                        if (!query.sensorId) {
                          return
                        }
                        queryClient.removeQueries({
                          queryKey: [QueryKey.SensorReportData, query]
                        })
                        sensorReportDataQuery.refetch()
                      }
                    }}
                    rowKey={(record) => record.id}
                    scroll={{
                      x: 'max-content'
                    }}
                    search={false}
                    toolBarRender={() => [
                      <Button key="export" onClick={handleExport}>
                        导出
                      </Button>
                    ]}
                  />
                )
              },
              {
                label: '趋势图',
                key: Tabs.Trend,
                children: (
                  <DataTrend
                    loading={loading}
                    sensorReportData={sensorReportData}
                    sensorReportDataField={sensorReportDataField}
                  />
                )
              }
            ]
          }}
        ></ProCard>
      </Space>
    </PageContainer>
  )
}

export default HistoryDataPage

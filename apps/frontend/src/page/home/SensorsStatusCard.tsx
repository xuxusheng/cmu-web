import { ApartmentOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useQuery } from '@tanstack/react-query'
import { Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useMemo } from 'react'
import { QueryKey } from '../../api/query-key.ts'
import { sensorApi } from '../../api/sensor.ts'
import { SensorBasicStatus } from '../../interface/sensor.ts'

export const SensorsStatusCard: FC = () => {
  const columns: ColumnsType<SensorBasicStatus> = [
    {
      title: '设备',
      dataIndex: 'descCn',
      key: 'descCn'
    },
    {
      title: '通讯状态',
      render: () => '-'
    },
    {
      title: '运行状态',
      render: () => '-'
    },
    {
      title: '数据状态',
      render: () => '-'
    },
    {
      title: '更新时间',
      render: () => '-'
    }
  ]

  const sensorStatusQuery = useQuery({
    queryKey: [QueryKey.SensorBasicStatus],
    queryFn: () => sensorApi.getSenBasicStatus(),
    refetchInterval: 1000 * 10, // 10s
    gcTime: 1000 * 60 * 10 // 10min 内乐观更新
  })

  const sensorStatus = useMemo(
    () => sensorStatusQuery.data?.data.data.list || [],
    [sensorStatusQuery.data]
  )

  return (
    <ProCard
      title={
        <Space>
          <ApartmentOutlined />
          监测设备状态
        </Space>
      }
    >
      <Table
        bordered={false}
        columns={columns}
        dataSource={sensorStatus}
        loading={sensorStatusQuery.isLoading}
        rowKey={(record) => record.senId}
        scroll={{ x: true }}
        size="small"
      ></Table>
    </ProCard>
  )
}

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  ActionType,
  ProCard,
  ProColumns,
  ProTable
} from '@ant-design/pro-components'
import { Button, Modal, Space, Tooltip, message } from 'antd'
import dayjs from 'dayjs'
import { FC, useRef, useState } from 'react'
import { i2SensorApi } from '../../../api/i2-sensor.ts'
import { I2SensorPageVO } from '../../../interface/i2-sensor.ts'
import { UpsertI2SensorModal } from './UpsertI2SensorModal.tsx'

export const I2SensorCard: FC = () => {
  const [modal, contextHolder] = Modal.useModal()

  // ----------------------------- State -----------------------------
  const actionRef = useRef<ActionType>()
  const [upsertModalProps, setUpsertModalProps] = useState<{
    id?: number
    open: boolean
  }>({
    open: false
  })

  // ----------------------------- Method -----------------------------
  const handleDelete = (id: number) => {
    modal.confirm({
      title: '删除 I2 传感器配置',
      content: '删除后无法恢复，确定删除？',
      onOk: async () => {
        await i2SensorApi.delete(id)
        message.success('删除 I2 传感器配置成功')
        actionRef.current?.reload()
      }
    })
  }

  // ------------------- Render -------------------
  const columns: ProColumns<I2SensorPageVO>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left'
    },
    {
      title: '传感器编码',
      dataIndex: 'code'
    },
    {
      title: '组名',
      dataIndex: 'groupName'
    },
    {
      title: '传感器名称',
      dataIndex: 'sensorDescCn'
    },
    {
      title: 'I2 设备描述',
      dataIndex: 'descCn'
    },
    {
      title: '一次设备编码',
      dataIndex: 'equipmentId'
    },
    {
      title: '数据上传周期(min)',
      dataIndex: 'dataUploadPeriod'
    },
    {
      title: '下次上传时间',
      dataIndex: 'nextDataUploadTime',
      renderText: (text) => text && dayjs(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '相别',
      dataIndex: 'phaseName'
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 72,
      fixed: 'right',
      render: (_, entity) => [
        <Space key="main" size={0}>
          <Tooltip mouseEnterDelay={0.5} title="更新 I2 传感器配置">
            <Button
              size="small"
              type="text"
              onClick={() =>
                setUpsertModalProps({
                  open: true,
                  id: entity.id
                })
              }
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip mouseEnterDelay={0.5} title="删除 I2 传感器配置">
            <Button
              key="del"
              size="small"
              type="text"
              onClick={() => handleDelete(entity.id)}
            >
              <DeleteOutlined style={{ color: '#ff4d4f' }} />
            </Button>
          </Tooltip>
        </Space>
      ]
    }
  ]

  return (
    <ProCard
      extra={
        <Tooltip mouseEnterDelay={0.5} title="添加 I2 传感器配置">
          <Button
            size="small"
            type="text"
            onClick={() => {
              setUpsertModalProps({ open: true })
            }}
          >
            <PlusOutlined />
          </Button>
        </Tooltip>
      }
      title="I2 设备配置"
    >
      {contextHolder}
      <ProTable<I2SensorPageVO>
        actionRef={actionRef}
        columns={columns}
        options={false}
        request={async (params) => {
          const { current = 1, pageSize = 10 } = params

          const res = await i2SensorApi.page({
            pn: current,
            ps: pageSize
          })

          const { total, items } = res.data.data
          return {
            data: items,
            total,
            success: true
          }
        }}
        rowKey={(record) => record.id}
        scroll={{
          x: 'max-content'
        }}
        search={false}
        size="small"
      />
      <UpsertI2SensorModal
        id={upsertModalProps.id}
        open={upsertModalProps.open}
        setOpen={(open: boolean) => setUpsertModalProps({ open: open })}
        onOk={() => actionRef.current?.reload()}
      />
    </ProCard>
  )
}

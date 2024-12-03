import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { ProCard, ProColumns, ProTable } from '@ant-design/pro-components'
import { useQuery } from '@tanstack/react-query'
import { Button, Modal, Space, Tooltip, Typography, message } from 'antd'
import { FC, useState } from 'react'

import { i2ConfigApi } from '../../../api/i2-config.ts'
import { QueryKey } from '../../../api/query-key.ts'
import { CagConfig } from '../../../interface/i2-config.ts'
import { UpsertCagModal } from './UpsertCagModal.tsx'

export const CagConfigCard: FC = () => {
  const [modal, contextHolder] = Modal.useModal()

  // ----------------------------- State -----------------------------
  const [upsertModalProps, setUpsertModalProps] = useState<{
    id?: number
    open: boolean
  }>({
    open: false
  })

  // ----------------------------- React-Query -----------------------------
  const cagListQuery = useQuery({
    queryKey: [QueryKey.CagConfigList],

    queryFn: () => i2ConfigApi.getCagList()
  })

  const cagList = cagListQuery.data?.data.data

  // ----------------------------- Method -----------------------------
  const handleDelete = (id: number) => {
    modal.confirm({
      title: '删除 CAG 配置',
      content: '删除后无法恢复，确定删除？',
      onOk: async () => {
        await i2ConfigApi.deleteCag(id)
        message.success('删除 CAG 配置成功')
        cagListQuery.refetch()
      }
    })
  }

  // ----------------------------- Render -----------------------------
  const columns: ProColumns<CagConfig>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left'
    },
    {
      title: 'IP 地址',
      key: 'cagIp',
      dataIndex: 'cagIp'
    },
    {
      title: '端口号',
      key: 'cagPort',
      dataIndex: 'cagPort'
    },
    {
      title: '服务地址',
      key: 'cagServiceLocate',
      dataIndex: 'cagServiceLocate',
      render: (value) => (
        <Typography.Link href={value as string} target="_blank">
          {value}
        </Typography.Link>
      )
    },
    {
      title: '命名空间',
      key: 'cagNamespace',
      dataIndex: 'cagNamespace'
    },
    {
      title: '超时时间',
      key: 'timeoutTime',
      dataIndex: 'timeoutTime'
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 72,
      render: (_, entity) => [
        <Space key="main" size={0}>
          <Tooltip mouseEnterDelay={0.5} title="更新配置信息">
            <Button
              key="update"
              size="small"
              type="text"
              onClick={() => {
                setUpsertModalProps({ open: true, id: entity.cagId })
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip mouseEnterDelay={0.5} title="删除配置">
            <Button
              key="del"
              size="small"
              type="text"
              onClick={() => handleDelete(entity.cagId)}
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
        <Tooltip mouseEnterDelay={0.5} title="添加 CAG 配置">
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
      title="CAG 配置"
    >
      {contextHolder}
      <UpsertCagModal
        id={upsertModalProps.id}
        open={upsertModalProps.open}
        setOpen={(open: boolean) => setUpsertModalProps({ open: open })}
      />
      <ProTable
        columns={columns}
        dataSource={cagList}
        loading={cagListQuery.isLoading}
        options={false}
        pagination={false}
        rowKey={(record) => record.cagId}
        scroll={{
          x: 'max-content'
        }}
        search={false}
        size="small"
      />
    </ProCard>
  )
}

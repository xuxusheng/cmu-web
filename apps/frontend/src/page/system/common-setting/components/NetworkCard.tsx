import { EditOutlined, GlobalOutlined, SearchOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useQuery } from '@tanstack/react-query'
import { Button, Input, Space, Table, Tag, Tooltip, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import * as ip from 'ipaddr.js'
import { LinkWithAddressInfo } from 'iproute'
import { FC, useMemo, useState } from 'react'

import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'
import { UpdateNetworkModal } from './UpdateNetworkModal.tsx'

export const NetworkCard: FC = () => {
  // ----------------------------- State -----------------------------
  const [keyword, setKeyword] = useState('')
  const [updateModalProps, setUpdateModalProps] = useState<{
    open: boolean
    ifname?: string
  }>({
    open: false
  })

  // ----------------------------- React-Query -----------------------------

  const ipAddressQuery = useQuery({
    queryKey: [QueryKey.SystemIpAddress],

    queryFn: () => systemApi.getIpAddress()
  })
  const ipAddress = useMemo(() => {
    return (ipAddressQuery.data?.data.data || []).filter(
      (v) =>
        (v.ifname.startsWith('eth') || v.ifname.startsWith('en')) &&
        v.ifname.startsWith(keyword)
    )
  }, [ipAddressQuery.data?.data.data, keyword])
  const ipRouteQuery = useQuery({
    queryKey: [QueryKey.SystemIpRoute],

    queryFn: () => systemApi.getIpRoute()
  })
  const ipRoute = ipRouteQuery.data?.data.data || []

  const networkInterfacesQuery = useQuery({
    queryKey: [QueryKey.NetworkInterfaces],
    queryFn: () => systemApi.getNetworkInterfaces(),
    refetchInterval: 1000 * 60
  })
  // ----------------------------- Render -----------------------------
  const columns: ColumnsType<LinkWithAddressInfo> = [
    {
      title: '网卡名称',
      dataIndex: 'ifname',
      fixed: 'left',
      render: (value) => {
        if (!keyword) {
          return value
        }

        const index = value.toLowerCase().indexOf(keyword.toLowerCase())
        if (index === -1) {
          return value
        }

        return (
          <>
            {value.slice(0, index)}
            <span style={{ backgroundColor: '#fcd34d' }}>
              {value.slice(index, index + keyword.length)}
            </span>
            {value.slice(index + keyword.length)}
          </>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'operstate',
      render: (value) => {
        switch (value) {
          case 'UP':
            return (
              <Tag bordered={false} color="success">
                {value}
              </Tag>
            )
          case 'DOWN':
            return (
              <Tag bordered={false} color="error">
                {value}
              </Tag>
            )
          default:
            return (
              <Tag bordered={false} color="default">
                {value}
              </Tag>
            )
        }
      }
    },
    {
      title: 'IP 地址',
      dataIndex: 'addr_info',
      render: (value: LinkWithAddressInfo['addr_info']) => {
        // 找到 family 为 inet 的对象，取其中的 local 作为 IP 地址
        const ip = value.find((v) => v.family === 'inet')?.local
        return ip ? (
          <Typography.Link href={`//${ip}`} target="_blank">
            {ip}
          </Typography.Link>
        ) : null
      }
    },
    {
      title: '子网掩码',
      dataIndex: 'addr_info',
      render: (value: LinkWithAddressInfo['addr_info']) => {
        // 找到 family 为 inet 的对象，取其中的 prefixlen 作为子网掩码
        const prefixlen = value.find((v) => v.family === 'inet')?.prefixlen
        if (prefixlen) {
          return ip.IPv4.subnetMaskFromPrefixLength(prefixlen).toString()
        }
      }
    },
    {
      title: '网关地址',
      dataIndex: 'gateway',
      render: (_, record) => {
        // 根据网卡名称，从 ipRoute 信息中查找网关信息
        return ipRoute.find((v) => v.dev === record.ifname && v.gateway)
          ?.gateway
      }
    },
    {
      title: '操作',
      fixed: 'right',
      width: 60,
      render: (_, record) => {
        return (
          <Tooltip mouseEnterDelay={0.5} title="更新网卡信息">
            <Button
              size="small"
              type="text"
              onClick={() =>
                setUpdateModalProps({ open: true, ifname: record.ifname })
              }
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        )
      }
    }
  ]

  return (
    <ProCard
      extra={
        <Input
          placeholder="请输入网卡名称"
          suffix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      }
      title={
        <Space>
          <GlobalOutlined />
          网络配置
        </Space>
      }
    >
      <UpdateNetworkModal
        ifname={updateModalProps.ifname}
        open={updateModalProps.open}
        onCancel={() => setUpdateModalProps({ open: false })}
        onOk={() => {
          setUpdateModalProps({ open: false })
          ipRouteQuery.refetch()
          ipAddressQuery.refetch()
        }}
      />
      <Table<LinkWithAddressInfo>
        columns={columns}
        dataSource={ipAddress}
        loading={networkInterfacesQuery.isLoading}
        pagination={false}
        rowKey={(record) => record.ifname}
        scroll={{
          x: 'max-content'
        }}
        size="small"
      />
    </ProCard>
  )
}

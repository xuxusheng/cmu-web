import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { useQuery } from '@tanstack/react-query'
import { Button, Modal, Space, Tooltip, message } from 'antd'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'
import { FC, useMemo } from 'react'

import { fileApi } from '../../../api/file.ts'
import { QueryKey } from '../../../api/query-key.ts'
import { CmuFile } from '../../../interface/file.ts'

export const LogFileTable: FC = () => {
  // ------------------------------------- React-Query -------------------------------------
  const fileListQuery = useQuery({
    queryKey: [QueryKey.LogFileList],
    queryFn: () => fileApi.getLogList(),
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60 * 10
  })

  // ------------------------------------- UseMemo -------------------------------------
  const fileList = useMemo(
    () => fileListQuery.data?.data.data || [],
    [fileListQuery]
  )

  // ------------------------------------- Method -------------------------------------
  const handleDelete = (filename: string) => {
    Modal.confirm({
      title: '日志文件删除后无法恢复，确认删除？',
      onOk: async () => {
        await fileApi.deleteLog(filename)
        fileListQuery.refetch()
        message.success(`删除日志文件 ${filename} 成功`)
        return true
      }
    })
  }

  // ------------------------------------- Render -------------------------------------
  const columns: ProColumns<CmuFile>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left'
    },
    {
      title: '文件名',
      dataIndex: 'filename'
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      renderText: (text) => prettyBytes(text)
    },
    {
      title: '修改时间',
      dataIndex: 'lastModified',
      width: 160,
      renderText: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      valueType: 'option',
      width: 60,
      fixed: 'right',
      render: (_, entity) => [
        <Space key="space">
          <Tooltip mouseEnterDelay={0.5} title="下载">
            <Button
              size="small"
              type="text"
              onClick={() => {
                fileApi.downloadLog(entity.filename)
              }}
            >
              <DownloadOutlined />
            </Button>
          </Tooltip>
          <Tooltip mouseEnterDelay={0.5} title="删除">
            <Button
              size="small"
              type="text"
              onClick={() => handleDelete(entity.filename)}
            >
              <DeleteOutlined style={{ color: '#ff4d4f' }} />
            </Button>
          </Tooltip>
        </Space>
      ]
    }
  ]

  return (
    <ProTable<CmuFile>
      columns={columns}
      dataSource={fileList}
      loading={fileListQuery.isLoading}
      options={false}
      pagination={false}
      rowKey={(record) => record.filename}
      scroll={{
        x: 'max-content'
      }}
      search={false}
      size="small"
    ></ProTable>
  )
}

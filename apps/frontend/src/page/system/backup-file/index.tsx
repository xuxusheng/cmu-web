import {
  DeleteOutlined,
  DownloadOutlined,
  FileZipOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Alert, Button, message, Modal, Space, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'
import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { QueryKey } from '../../../api/query-key.ts'
import { systemConfigApi } from '../../../api/system-config.ts'
import { BackupFile } from '../../../interface/file.ts'

export const BackupFilePage: FC = () => {
  const navigate = useNavigate()

  // ------------------------------------- React-Query -------------------------------------
  const generateMutation = useMutation({
    mutationFn: systemConfigApi.generateBackupFile
  })
  const deleteMutation = useMutation({
    mutationFn: (filename: string) => systemConfigApi.deleteBackupFile(filename)
  })
  const fileListQuery = useQuery({
    queryKey: [QueryKey.IcdFileList],
    queryFn: () => systemConfigApi.listBackupFiles(),
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60 * 10
  })

  // ------------------------------------- UseMemo -------------------------------------
  const fileList = useMemo(
    () => fileListQuery.data?.data.data || [],
    [fileListQuery]
  )

  // ------------------------------------- Method -------------------------------------
  const handleGenerate = async () => {
    if (generateMutation.isPending) {
      return
    }
    await generateMutation.mutateAsync()
    await fileListQuery.refetch()
    message.success(`一键备份成功`)
  }

  // ------------------------------------- Render -------------------------------------
  const columns: ProColumns<BackupFile>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left'
    },
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename'
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
      renderText: (text) => prettyBytes(text)
    },
    {
      title: '修改时间',
      dataIndex: 'lastModified',
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
                systemConfigApi.downloadBackupFile(entity.filename)
              }}
            >
              <DownloadOutlined />
            </Button>
          </Tooltip>
          <Tooltip mouseEnterDelay={0.5} title="删除">
            <Button
              size="small"
              type="text"
              onClick={() => {
                Modal.confirm({
                  width: 480,
                  title: '删除备份文件',
                  content: (
                    <Typography.Text>
                      文件&nbsp;
                      <Typography.Text className="!text-lg" type="danger">
                        {entity.filename}
                      </Typography.Text>
                      &nbsp;删除后将无法恢复，确定删除？
                    </Typography.Text>
                  ),
                  okText: '确定',
                  cancelText: '取消',
                  onOk: async () => {
                    await deleteMutation.mutateAsync(entity.filename)
                    fileListQuery.refetch()
                    message.success(`删除成功`)
                  }
                })
              }}
            >
              <DeleteOutlined style={{ color: '#ff4d4f' }} />
            </Button>
          </Tooltip>
        </Space>
      ]
    }
  ]

  return (
    <PageContainer
      breadcrumb={{
        items: [
          {
            path: '/',
            title: <HomeOutlined />,
            onClick: () => navigate('/')
          },
          { title: '系统设置' },
          { title: '一键备份' }
        ]
      }}
      title={false}
    >
      <ProTable<BackupFile>
        columns={columns}
        headerTitle={
          <Alert
            banner={true}
            type="info"
            message="一键备份 mms_config.xml、cfg.sqlite3、cfg_i2.sqlite3 及 ICD 文件"
          />
        }
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
        toolBarRender={() => [
          <Button
            key="generate"
            type="primary"
            loading={generateMutation.isPending}
            icon={<FileZipOutlined />}
            onClick={handleGenerate}
          >
            一键备份
          </Button>
        ]}
      ></ProTable>
    </PageContainer>
  )
}

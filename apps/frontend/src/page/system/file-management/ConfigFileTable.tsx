import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DisconnectOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons'
import {
  ModalForm,
  ProColumns,
  ProFormRadio,
  ProFormText,
  ProTable
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Alert, Button, Space, Tag, Tooltip, message } from 'antd'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'
import { FC, useMemo, useRef } from 'react'
import { fileApi } from '../../../api/file.ts'
import { QueryKey } from '../../../api/query-key.ts'
import {
  ConfigFileType,
  ConfigFileTypeLabelMap
} from '../../../const/enum/config-file.ts'
import { CmuFile } from '../../../interface/file.ts'
import styles from './ConfigFileTable.module.scss'

export const ConfigFileTable: FC = () => {
  // ------------------------------------- State -------------------------------------
  const uploadRef = useRef<HTMLInputElement>(null)

  // ------------------------------------- React-Query -------------------------------------
  const uploadMutation = useMutation({
    mutationFn: fileApi.uploadConfigFiles
  })
  const applyMutation = useMutation({
    mutationFn: fileApi.applyConfigFile
  })
  const fileListQuery = useQuery({
    queryKey: [QueryKey.ConfigFileList],
    queryFn: () => fileApi.getConfigList(),
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60 * 10
  })

  // ------------------------------------- UseMemo -------------------------------------
  const fileList = useMemo(
    () => fileListQuery.data?.data.data || [],
    [fileListQuery]
  )

  // ------------------------------------- Method -------------------------------------
  const handleFileUpload = async () => {
    const files = uploadRef.current?.files
    if (!files?.length) {
      return
    }

    try {
      await uploadMutation.mutateAsync(Array.from(files))
    } finally {
      // 重置文件，避免影响下次再选择相同文件时不触发 onChange 事件
      uploadRef.current!.value = ''
    }

    fileListQuery.refetch()
    message.success('上传配置文件成功')
  }

  // ------------------------------------- Render -------------------------------------
  const columns: ProColumns<CmuFile>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48
    },
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      render: (_, entity) => (
        <Tooltip placement="right" title={entity.filePath}>
          {entity.filename}
        </Tooltip>
      )
    },
    {
      title: '状态',
      render: (_, entity) => {
        const softLinkFile = fileList.find(
          (v) => v.isSymbolicLink && v.target === entity.filename
        )

        if (!softLinkFile) {
          return (
            <ModalForm
              labelCol={{ span: 4 }}
              layout="horizontal"
              modalProps={{
                destroyOnClose: true,
                confirmLoading: applyMutation.isPending
              }}
              title="应用配置文件"
              trigger={
                <Tooltip title="应用配置文件">
                  <Button size="small" type="text">
                    <DisconnectOutlined />
                  </Button>
                </Tooltip>
              }
              width={520}
              onFinish={async ({ type }) => {
                await applyMutation.mutateAsync({
                  filename: entity.filename,
                  type
                })
                fileListQuery.refetch()
                return true
              }}
            >
              <Alert
                className="mb-6"
                message="修改配置文件会影响系统功能，且重启后才会生效，请谨慎操作！"
                type="warning"
              />
              <ProFormText
                disabled={true}
                initialValue={entity.filename}
                label="配置文件"
                name="filename"
              />
              <ProFormRadio.Group
                initialValue={ConfigFileType.N}
                label="应用为"
                name="type"
                options={[
                  {
                    label: ConfigFileTypeLabelMap[ConfigFileType.N],
                    value: ConfigFileType.N
                  },
                  {
                    label: ConfigFileTypeLabelMap[ConfigFileType.S],
                    value: ConfigFileType.S
                  }
                ]}
                rules={[{ required: true }]}
              />
            </ModalForm>
          )
        }

        if (softLinkFile.filename === ConfigFileType.S) {
          return (
            <Tag
              bordered={false}
              color="processing"
              icon={<ArrowDownOutlined />}
            >
              {ConfigFileTypeLabelMap[ConfigFileType.S]}
            </Tag>
          )
        }
        if (softLinkFile.filename === ConfigFileType.N) {
          return (
            <Tag bordered={false} color="processing" icon={<ArrowUpOutlined />}>
              {ConfigFileTypeLabelMap[ConfigFileType.N]}
            </Tag>
          )
        }
      }
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
          <Tooltip title="下载">
            <Button
              size="small"
              type="text"
              onClick={() => {
                fileApi.downloadConfig(entity.filename)
              }}
            >
              <DownloadOutlined />
            </Button>
          </Tooltip>
        </Space>
      ]
    }
  ]

  return (
    <div className={styles.main}>
      <input
        accept=".sqlite3"
        id="upload-files"
        multiple={true}
        ref={uploadRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileUpload}
      />
      <ProTable<CmuFile>
        columns={columns}
        dataSource={fileList.filter((f) => !f.isSymbolicLink)}
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
          <Tooltip
            key="upload"
            title="选择 .sqlite3 文件，且文件名不能为 cfg.sqlite3 或 cfg_i2.sqlite3"
          >
            <Button
              loading={uploadMutation.isPending}
              type="primary"
              onClick={() => uploadRef.current?.click()}
            >
              <UploadOutlined />
              上传配置文件
            </Button>
          </Tooltip>
        ]}
      ></ProTable>{' '}
    </div>
  )
}

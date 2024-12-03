import {
  DownloadOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Space, Tooltip, message } from 'antd'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'
import { FC, useMemo, useRef, useState } from 'react'

import { fileApi } from '../../../api/file.ts'
import { QueryKey } from '../../../api/query-key.ts'
import { CmuFile } from '../../../interface/file.ts'
import { IcdFileContentModal } from './IcdFileContentModal.tsx'
import styles from './IcdFileTable.module.scss'

export const IcdFileTable: FC = () => {
  // ------------------------------------- State -------------------------------------
  const uploadRef = useRef<HTMLInputElement>(null)
  const [icdContentModalProps, setIcdContentModalProps] = useState({
    open: false,
    filename: ''
  })

  // ------------------------------------- React-Query -------------------------------------
  const uploadMutation = useMutation({
    mutationFn: fileApi.uploadIcdFiles
  })
  const fileListQuery = useQuery({
    queryKey: [QueryKey.IcdFileList],
    queryFn: () => fileApi.getIcdList(),
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
    message.success('上传 ICD 文件成功')
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
          <Tooltip mouseEnterDelay={0.5} title="查看文件内容">
            <Button
              size="small"
              type="text"
              onClick={() =>
                setIcdContentModalProps({
                  open: true,
                  filename: entity.filename
                })
              }
            >
              <SearchOutlined />
            </Button>
          </Tooltip>
          <Tooltip mouseEnterDelay={0.5} title="下载">
            <Button
              size="small"
              type="text"
              onClick={() => {
                fileApi.downloadIcd(entity.filename)
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
      <IcdFileContentModal
        filename={icdContentModalProps.filename}
        open={icdContentModalProps.open}
        setOpen={() => setIcdContentModalProps({ open: false, filename: '' })}
      />
      <input
        accept=".icd"
        id="upload-files"
        multiple={true}
        ref={uploadRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileUpload}
      />
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
        toolBarRender={() => [
          <Button
            key="upload"
            loading={uploadMutation.isPending}
            type="primary"
            onClick={() => uploadRef.current?.click()}
          >
            <UploadOutlined />
            上传 ICD 文件
          </Button>
        ]}
      ></ProTable>
    </div>
  )
}

import { EditOutlined, FileOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProCard,
  ProDescriptions,
  ProFormDigit,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Space, Spin, message } from 'antd'
import prettyBytes from 'pretty-bytes'
import { FC, useEffect } from 'react'

import { QueryKey } from '../../../api/query-key.ts'
import { systemConfigApi } from '../../../api/system-config.ts'
import { LogConfig } from '../../../interface/system-config.ts'

type FormState = LogConfig

export const LogConfigCard: FC = () => {
  // ----------------------------- State -----------------------------
  const [form] = Form.useForm<FormState>()

  // ----------------------------- React-Query -----------------------------
  const updateMutation = useMutation({
    mutationFn: systemConfigApi.setLogConfig
  })
  const logConfigQuery = useQuery({
    queryKey: [QueryKey.LogConfig],
    queryFn: () => systemConfigApi.getLogConfig()
  })
  const logConfig = logConfigQuery.data?.data.data
  useEffect(() => {
    if (!logConfig) {
      return
    }
    form.setFieldsValue(logConfig)
  }, [form, logConfig])

  // ----------------------------- UseMemo -----------------------------
  const confirmLoading = updateMutation.isPending
  const loading = logConfigQuery.isLoading || updateMutation.isPending

  // ----------------------------- Method -----------------------------
  const handleUploadModalOpen = (open: boolean) => {
    if (open && logConfig) {
      form.setFieldsValue(logConfig)
    }
  }

  const handleUpdate = async (values: FormState) => {
    await updateMutation.mutateAsync(values)
    message.success('更新日志配置成功')
    logConfigQuery.refetch()
    return true
  }

  // ----------------------------- Render -----------------------------
  const renderUpdateModal = () => {
    return (
      <ModalForm<FormState>
        autoFocusFirstInput={true}
        form={form}
        isKeyPressSubmit={true}
        labelCol={{ span: 7 }}
        layout="horizontal"
        loading={confirmLoading}
        modalProps={{
          destroyOnClose: true,
          forceRender: true
        }}
        title="更新日志配置"
        trigger={
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        }
        width={560}
        onFinish={handleUpdate}
        onOpenChange={handleUploadModalOpen}
      >
        <Spin spinning={loading}>
          <ProFormSwitch
            label="启用日志文件"
            name="logFileEnable"
            rules={[{ required: true }]}
          />
          <ProFormDigit
            label="日志文件大小"
            name="logFileSize"
            rules={[{ required: true, message: '日志文件大小不能为空' }]}
          />
          <ProFormSwitch
            label="启用缓存"
            name="logCacheEnable"
            rules={[
              {
                required: true,
                message: '启用缓存不能为空'
              }
            ]}
          />
          <ProFormDigit
            label="日志缓存大小"
            name="logBufferSize"
            rules={[{ required: true, message: '日志缓存大小不能为空' }]}
          />
          <ProFormText
            label="日志目录"
            name="logDir"
            rules={[{ required: true, message: '日志目录不能为空' }]}
            tooltip="绝对路径"
          />
          <ProFormDigit
            label="最大日志文件个数"
            name="logFileMaxNum"
            rules={[{ required: true, message: '最大日志文件个数不能为空' }]}
          />
          <ProFormText
            label="日志文件名"
            name="logFileName"
            rules={[{ required: true, message: '日志文件名不能为空' }]}
          />
          <ProFormSwitch
            label="是否分割日志"
            name="logFileSplitEnable"
            rules={[
              {
                required: true,
                message: '是否分割日志不能为空'
              }
            ]}
          />
        </Spin>
      </ModalForm>
    )
  }

  return (
    <ProCard
      extra={renderUpdateModal()}
      loading={logConfigQuery.isLoading}
      title={
        <Space>
          <FileOutlined />
          <span>日志配置</span>
        </Space>
      }
    >
      {logConfig && (
        <ProDescriptions<FormState>>
          <ProDescriptions.Item label="启用日志文件">
            {logConfig.logFileEnable ? '是' : '否'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="日志文件大小">
            {prettyBytes(logConfig.logFileSize)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="启用缓存">
            {logConfig.logCacheEnable ? '是' : '否'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="日志缓存大小">
            {prettyBytes(logConfig.logBufferSize)}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="日志目录" tooltip="绝对路径">
            {logConfig.logDir}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="最大日志文件个数">
            {logConfig.logFileMaxNum}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="日志文件名">
            {logConfig.logFileName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="是否分割日志">
            {logConfig.logFileSplitEnable ? '是' : '否'}
          </ProDescriptions.Item>
        </ProDescriptions>
      )}
    </ProCard>
  )
}

import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProCard,
  ProDescriptions,
  ProFormDigit,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Space, Spin, message } from 'antd'
import { FC, useEffect, useMemo } from 'react'
import { fileApi } from '../../../api/file.ts'
import { QueryKey } from '../../../api/query-key.ts'
import { systemConfigApi } from '../../../api/system-config.ts'
import { MmsConfig } from '../../../interface/system-config.ts'

type FormState = MmsConfig

export const MmsConfigCard: FC = () => {
  // ----------------------------- State -----------------------------------
  const [form] = Form.useForm<FormState>()
  const selectedIcdFileName = Form.useWatch('icdFileName', form)

  // ----------------------------- React-Query -----------------------------
  const updateMutation = useMutation({
    mutationFn: systemConfigApi.setMmsConfig
  })

  const iedAndApNameQuery = useQuery({
    queryKey: [QueryKey.IedAndApName, selectedIcdFileName],
    queryFn: () => systemConfigApi.getIedAndApName(selectedIcdFileName),
    enabled: !!selectedIcdFileName
  })

  useEffect(() => {
    const data = iedAndApNameQuery.data?.data.data
    if (data) {
      const iedName = data.iedName
      const apName = data.apNameList[0]
      form.setFieldsValue({ iedName, apName })
    }
  }, [form, iedAndApNameQuery.data?.data.data])

  const mmsConfigQuery = useQuery({
    queryKey: [QueryKey.MmsConfig],

    queryFn: () => systemConfigApi.getMmsConfig()
  })
  const mmsConfig = mmsConfigQuery.data?.data.data

  useEffect(() => {
    if (mmsConfig) {
      form.setFieldsValue(mmsConfig)
    }
  }, [form, mmsConfig])

  const icdFileListQuery = useQuery({
    queryKey: [QueryKey.IcdFileList],

    queryFn: () => fileApi.getIcdList()
  })
  const icdFileList = icdFileListQuery.data?.data.data || []

  const confirmLoading = updateMutation.isPending

  const loading = mmsConfigQuery.isLoading || updateMutation.isPending

  // ----------------------------- Memo ----------------------------------
  const apNameOptions = useMemo(
    () =>
      (iedAndApNameQuery.data?.data.data.apNameList || []).map((item) => ({
        label: item,
        value: item
      })),
    [iedAndApNameQuery.data]
  )

  // ----------------------------- Effect -----------------------------------

  // ----------------------------- Method -----------------------------

  const handleUploadModalOpen = (open: boolean) => {
    if (open && mmsConfig) {
      form.setFieldsValue(mmsConfig)
    }
  }

  const handleSelectedIcdFileNameChange = (value?: string) => {
    form.setFieldsValue({
      iedName: '',
      apName: undefined
    })

    if (!value) {
      form.validateFields()
    }
  }

  const handleUpdate = async (values: FormState) => {
    await updateMutation.mutateAsync(values)
    message.success('更新 MMS 配置成功')
    mmsConfigQuery.refetch()
    return true
  }

  // ----------------------------- Render -----------------------------

  const renderUpdateModal = () => {
    return (
      <ModalForm<FormState>
        form={form}
        isKeyPressSubmit={true}
        labelCol={{ span: 7 }}
        layout="horizontal"
        loading={confirmLoading}
        modalProps={{
          destroyOnClose: true,
          forceRender: true
        }}
        title="更新 MMS 配置"
        trigger={
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        }
        width={640}
        onFinish={handleUpdate}
        onOpenChange={handleUploadModalOpen}
      >
        <Spin spinning={loading}>
          <ProFormText
            disabled={true}
            label="ICD 文件目录"
            name="icdFileDir"
            rules={[{ required: true, message: '请输入 ICD 文件目录' }]}
          />
          <ProFormSelect
            fieldProps={{
              loading: icdFileListQuery.isLoading
            }}
            label="ICD 文件名"
            name="icdFileName"
            options={icdFileList.map((item) => ({
              label: item.filename,
              value: item.filename
            }))}
            rules={[{ required: true, message: '请选择 ICD 文件名' }]}
            onChange={handleSelectedIcdFileNameChange}
          />
          <ProFormText
            disabled={true}
            label="IED 名称"
            name="iedName"
            rules={[{ required: true, message: '请输入 IED 名称' }]}
          />
          <ProFormSelect
            fieldProps={{
              loading: iedAndApNameQuery.isLoading
            }}
            label="AP 名称"
            name="apName"
            options={apNameOptions}
            rules={[{ required: true, message: '请选择 AP 名称' }]}
          />
          <ProFormDigit
            label="MMS 报告扫描频率"
            name="mmsReportScanRate"
            rules={[
              {
                required: true,
                message: '请输入 MMS 报告扫描频率'
              }
            ]}
          />
          <ProFormDigit
            label="MMS 报告缓存大小"
            name="mmsReportCacheSize"
            rules={[{ required: true, message: '请输入 MMS 报告缓存大小' }]}
          />
          <ProFormDigit
            label="MMS 日志扫描频率"
            name="mmsLogScanRate"
            rules={[{ required: true, message: '请输入 MMS 日志扫描频率' }]}
          />
          <ProFormDigit
            label="MMS 日志最大条目数"
            name="mmsLogMaxEntry"
            rules={[{ required: true, message: '请输入 MMS 日志最大条目数' }]}
          />
          <ProFormText
            disabled={true}
            label="MMS 日志 Tag 名"
            name="mmsLogTagName"
            rules={[{ required: true, message: '请输入 MMS 日志 Tag 名' }]}
          />
          <ProFormText
            label="MMS 日志存储文件"
            name="mmsLogFile"
            rules={[{ required: true, message: '请输入 MMS 日志存储文件' }]}
          />
          <ProFormDigit
            label="MMS 日志存储条目数"
            name="mmsLogEntry"
            rules={[{ required: true, message: '请输入 MMS 日志存储条目数' }]}
          />
          <ProFormText
            label="MMS 文件目录"
            name="mmsFileDir"
            rules={[{ required: true, message: '请输入 MMS 文件目录' }]}
          />
        </Spin>
      </ModalForm>
    )
  }

  return (
    <ProCard
      extra={renderUpdateModal()}
      loading={mmsConfigQuery.isLoading}
      title={
        <Space>
          <SettingOutlined />
          <span>MMS 配置</span>
        </Space>
      }
    >
      {mmsConfig && (
        <ProDescriptions size="small">
          <ProDescriptions.Item label="ICD 文件目录" span={3}>
            {mmsConfig.icdFileDir}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="ICD 文件名" span={3}>
            {mmsConfig.icdFileName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="IED 名称">
            {mmsConfig.iedName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="AP 名称">
            {mmsConfig.apName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS 报告扫描频率">
            {mmsConfig.mmsReportScanRate}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS报告缓存大小">
            {mmsConfig.mmsReportCacheSize}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS日志扫描频率">
            {mmsConfig.mmsLogScanRate}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS日志最大条目数">
            {mmsConfig.mmsLogMaxEntry}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS日志Tag名">
            {mmsConfig.mmsLogTagName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS日志存储文件">
            {mmsConfig.mmsLogFile}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS日志存储条目数">
            {mmsConfig.mmsLogEntry}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="MMS文件目录">
            {mmsConfig.mmsFileDir}
          </ProDescriptions.Item>
        </ProDescriptions>
      )}
    </ProCard>
  )
}

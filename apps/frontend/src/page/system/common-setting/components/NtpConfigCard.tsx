import { ClockCircleOutlined, EditOutlined } from '@ant-design/icons'
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
import { FC, useEffect, useMemo } from 'react'
import { QueryKey } from '../../../../api/query-key.ts'
import { systemConfigApi } from '../../../../api/system-config.ts'
import { NtpConfig } from '../../../../interface/system-config.ts'

type FormState = NtpConfig

export const NtpConfigCard: FC = () => {
  // ----------------------------- State -----------------------------------
  const [form] = Form.useForm<FormState>()

  // ----------------------------- React-Query -----------------------------
  const updateMutation = useMutation({
    mutationFn: systemConfigApi.setNtpConfig
  })
  const ntpConfigQuery = useQuery({
    queryKey: [QueryKey.NtpConfig],
    queryFn: () => systemConfigApi.getNtpConfig()
  })
  const ntpConfig = ntpConfigQuery.data?.data.data
  useEffect(() => {
    if (ntpConfig) {
      form.setFieldsValue(ntpConfig)
    }
  }, [form, ntpConfig])

  // ----------------------------- UseMemo -----------------------------

  const confirmLoading = useMemo(
    () => updateMutation.isPending,
    [updateMutation.isPending]
  )
  const loading = useMemo(
    () => ntpConfigQuery.isLoading || updateMutation.isPending,
    [ntpConfigQuery.isLoading, updateMutation.isPending]
  )

  // ----------------------------- Method -----------------------------

  const handleUploadModalOpen = (open: boolean) => {
    if (open && ntpConfig) {
      form.setFieldsValue(ntpConfig)
    }
  }

  const handleUpdate = async (values: FormState) => {
    await updateMutation.mutateAsync(values)
    message.success('更新 NTP 配置成功')
    ntpConfigQuery.refetch()
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
        title="更新 NTP 配置"
        trigger={
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        }
        width={480}
        onFinish={handleUpdate}
        onOpenChange={handleUploadModalOpen}
      >
        <Spin spinning={loading}>
          <ProFormText
            label="NTP 服务器 IP"
            name="ntpServerIp"
            rules={[{ required: true, message: 'NTP 服务器 IP 不能为空' }]}
          />
          <ProFormDigit
            label="对时周期(s)"
            name="syncCycle"
            rules={[{ required: true, message: '对时周期不能为空' }]}
          />
          <ProFormSwitch
            label="是否启用共享"
            name="isUseSharedMem"
            rules={[{ required: true, message: '是否启用共享不能为空' }]}
          />
          <ProFormDigit
            label="网络超时时间(s)"
            name="outTime"
            rules={[{ required: true, message: '网络超时时间不能为空' }]}
          />
        </Spin>
      </ModalForm>
    )
  }

  return (
    <ProCard
      extra={renderUpdateModal()}
      loading={ntpConfigQuery.isLoading}
      title={
        <Space>
          <ClockCircleOutlined />
          <span>更新 NTP 配置</span>
        </Space>
      }
    >
      {ntpConfig && (
        <ProDescriptions size="small">
          <ProDescriptions.Item label="NTP 服务器 IP">
            {ntpConfig.ntpServerIp}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="对时周期(秒)">
            {ntpConfig.syncCycle}s
          </ProDescriptions.Item>
          <ProDescriptions.Item label="是否启用共享">
            {ntpConfig.isUseSharedMem ? '是' : '否'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="网络超时时间(秒)">
            {ntpConfig.outTime}s
          </ProDescriptions.Item>
        </ProDescriptions>
      )}
    </ProCard>
  )
}

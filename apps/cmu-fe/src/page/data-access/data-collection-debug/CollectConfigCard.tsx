import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EditOutlined
} from '@ant-design/icons'
import {
  ModalForm,
  ProCard,
  ProDescriptions,
  ProFormDigit,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Space, Spin, Tooltip, message } from 'antd'
import { FC, useEffect } from 'react'
import { QueryKey } from '../../../api/query-key.ts'
import { systemConfigApi } from '../../../api/system-config.ts'
import { CollectConfig } from '../../../interface/system-config.ts'

type FormState = CollectConfig

export const CollectConfigCard: FC = () => {
  // ----------------------------- State -----------------------------
  const [form] = Form.useForm<FormState>()

  // ----------------------------- React-Query -----------------------------
  const updateMutation = useMutation({
    mutationFn: systemConfigApi.updateCollectConfig
  })
  const collectConfigQuery = useQuery({
    queryKey: [QueryKey.CollectConfig],
    queryFn: () => systemConfigApi.getCollectConfig()
  })

  useEffect(() => {
    const data = collectConfigQuery.data?.data.data
    if (!data) {
      return
    }
    form.setFieldsValue(data)
  }, [collectConfigQuery.data?.data.data, form])

  const collectConfig = collectConfigQuery.data?.data.data
  const confirmLoading = updateMutation.isPending
  const formLoading = collectConfigQuery.isLoading || updateMutation.isPending
  const loading = collectConfigQuery.isLoading

  // ----------------------------- Method -----------------------------
  const handleUploadModalOpen = (open: boolean) => {
    if (open && collectConfig) {
      form.setFieldsValue(collectConfig)
    }
  }

  const handleUpdate = async (values: FormState) => {
    await updateMutation.mutateAsync(values)
    message.success('更新采集参数配置成功')
    collectConfigQuery.refetch()
    return true
  }

  // ----------------------------- Render -----------------------------
  const renderUpdateModal = () => {
    return (
      <ModalForm<FormState>
        form={form}
        isKeyPressSubmit={true}
        labelCol={{ span: 9 }}
        layout="horizontal"
        loading={confirmLoading}
        modalProps={{ destroyOnClose: true, forceRender: true }}
        title="更新采集参数配置"
        trigger={
          <Tooltip mouseEnterDelay={0.5} title="更新采集参数配置">
            <Button size="small" type="text">
              <EditOutlined />
            </Button>
          </Tooltip>
        }
        width={560}
        onFinish={handleUpdate}
        onOpenChange={handleUploadModalOpen}
      >
        <Spin spinning={formLoading}>
          <ProFormSwitch
            label="自动采集"
            name="autoRun"
            rules={[{ required: true, message: '自动采集不能为空' }]}
          />

          <ProFormDigit
            label="CPU 利用率告警阈值"
            max={100}
            min={0}
            name="cpuTh"
            rules={[{ required: true, message: 'CPU 利用率告警阈值不能为空' }]}
          />

          <ProFormDigit
            label="内存利用率告警阈值"
            max={100}
            min={0}
            name="memoryTh"
            rules={[{ required: true, message: '内存利用率告警阈值不能为空' }]}
          />

          <ProFormSwitch
            label="进行 61850 上送"
            name="sendMsg"
            rules={[{ required: true, message: '进行 61850 上送不能为空' }]}
          />

          <ProFormDigit
            label="61850 发送无效数据值"
            min={Number.MIN_SAFE_INTEGER}
            name="invalidData"
            rules={[
              { required: true, message: '61850 发送无效数据值不能为空' }
            ]}
          />
          <ProFormDigit
            label="61850 发送无效数据品质"
            min={Number.MIN_SAFE_INTEGER}
            name="invalidQuality"
            rules={[
              { required: true, message: '61850 发送无效数据品质不能为空' }
            ]}
          />

          <ProFormDigit
            label="保存模式"
            name="saveMode"
            rules={[{ required: true, message: '保存模式不能为空' }]}
          />

          <ProFormDigit
            label="声光报警 DO"
            name="soundAlmDo"
            rules={[{ required: true, message: '声光报警 DO 不能为空' }]}
          />

          <ProFormText
            label="静态文件存放格式"
            name="destStaticFile"
            rules={[{ required: true, message: '静态文件存放格式不能为空' }]}
          />

          <ProFormText
            label="静态文件源文件"
            name="sourceStaticFile"
            rules={[{ required: true, message: '静态文件源文件不能为空' }]}
          />
        </Spin>
      </ModalForm>
    )
  }

  return (
    <ProCard extra={renderUpdateModal()} loading={loading} title="采集参数配置">
      <ProDescriptions size="small">
        <ProDescriptions.Item label="自动采集">
          <Space>
            {collectConfig?.autoRun === 1 && (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            )}

            {collectConfig?.autoRun === 0 && (
              <CloseCircleTwoTone twoToneColor="#eb2f96" />
            )}
          </Space>
        </ProDescriptions.Item>

        <ProDescriptions.Item label="CPU 利用率告警阈值">
          {collectConfig?.cpuTh}%
        </ProDescriptions.Item>

        <ProDescriptions.Item label="内存利用率告警阈值">
          {collectConfig?.memoryTh}%
        </ProDescriptions.Item>

        <ProDescriptions.Item label="进行 61850 上送">
          <Space>
            {collectConfig?.sendMsg === 1 && (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            )}

            {collectConfig?.sendMsg === 0 && (
              <CloseCircleTwoTone twoToneColor="#eb2f96" />
            )}
          </Space>
        </ProDescriptions.Item>

        <ProDescriptions.Item label="61850 发送无效数据值">
          {collectConfig?.invalidData}
        </ProDescriptions.Item>

        <ProDescriptions.Item label="61850 发送无效数据品质">
          {collectConfig?.invalidQuality}
        </ProDescriptions.Item>

        <ProDescriptions.Item label="保存模式">
          {collectConfig?.saveMode}
        </ProDescriptions.Item>

        <ProDescriptions.Item label="声光报警 DO">
          {collectConfig?.soundAlmDo}
        </ProDescriptions.Item>

        <ProDescriptions.Item ellipsis={true} label="静态文件存放格式">
          {collectConfig?.destStaticFile}
        </ProDescriptions.Item>

        <ProDescriptions.Item ellipsis={true} label="静态文件源文件">
          {collectConfig?.sourceStaticFile}
        </ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
  )
}

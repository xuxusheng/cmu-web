import { EditOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProCard,
  ProDescriptions,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Spin, Tooltip, message } from 'antd'
import { FC, useEffect } from 'react'

import { i2ConfigApi } from '../../../api/i2-config.ts'
import { QueryKey } from '../../../api/query-key.ts'
import { CacConfig } from '../../../interface/i2-config.ts'

type FormState = CacConfig

export const CacConfigCard: FC = () => {
  // ----------------------------- State -----------------------------
  const [form] = Form.useForm<FormState>()

  // ----------------------------- React-Query -----------------------------
  const updateMutation = useMutation({
    mutationFn: i2ConfigApi.updateCac
  })
  const cacQuery = useQuery({
    queryKey: [QueryKey.CacConfig],
    queryFn: () => i2ConfigApi.getCac()
  })
  const cac = cacQuery.data?.data.data

  useEffect(() => {
    if (!cac) {
      return
    }
    form.setFieldsValue(cac)
  }, [cac, form])

  const confirmLoading = updateMutation.isPending
  const formLoading = cacQuery.isLoading || updateMutation.isPending
  const loading = cacQuery.isLoading

  // ----------------------------- Method -----------------------------
  const handleUploadModalOpen = (open: boolean) => {
    if (open && cac) {
      form.setFieldsValue(cac)
    }
  }

  const handleUpdate = async (values: FormState) => {
    await updateMutation.mutateAsync(values)
    message.success('更新 CAC 配置成功')
    cacQuery.refetch()
    return true
  }

  // ----------------------------- Render -----------------------------
  const renderUpdateModal = () => {
    return (
      <ModalForm<FormState>
        form={form}
        isKeyPressSubmit={true}
        labelCol={{ span: 6 }}
        layout="horizontal"
        loading={confirmLoading}
        modalProps={{
          destroyOnClose: true,
          forceRender: true
        }}
        title="更新 CAC 配置"
        trigger={
          <Tooltip mouseEnterDelay={0.5} title="更新 CAC 配置">
            <Button size="small" type="text">
              <EditOutlined />
            </Button>
          </Tooltip>
        }
        width={520}
        onFinish={handleUpdate}
        onOpenChange={handleUploadModalOpen}
      >
        <Spin spinning={formLoading}>
          <ProFormText
            label="编号"
            name="cacId"
            rules={[{ required: true, message: '编号不能为空' }]}
          />
          <ProFormText
            label="IP 地址"
            name="cacIp"
            rules={[
              { required: true, message: 'P 地址不能为空' },
              {
                // 校验是否为 ip 地址
                pattern: new RegExp(
                  '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?<!\\.$)\\.)){4}$'
                ),
                message: '请输入正确的 IP 地址'
              }
            ]}
          />
          <ProFormDigit
            label="心跳周期"
            name="heartbeatPeriod"
            rules={[{ required: true, message: '心跳周期不能为空' }]}
          />
          <ProFormDateTimePicker
            dataFormat={'YYYY-MM-DD HH:mm'}
            fieldProps={{
              format: 'YYYY-MM-DD HH:mm'
            }}
            label="下次心跳时间"
            name="nextHeartbeatTime"
            rules={[{ required: true, message: '下次心跳时间不能为空' }]}
            width="lg"
          />
        </Spin>
      </ModalForm>
    )
  }

  return (
    <ProCard extra={renderUpdateModal()} loading={loading} title="CAC 配置">
      {cac && (
        <ProDescriptions size="small">
          <ProDescriptions.Item label="CAC 编码">
            {cac.cacId}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="IP 地址">
            {cac.cacIp}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="心跳周期">
            {cac.heartbeatPeriod}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="下次心跳时间">
            {cac.nextHeartbeatTime}
          </ProDescriptions.Item>
        </ProDescriptions>
      )}
    </ProCard>
  )
}

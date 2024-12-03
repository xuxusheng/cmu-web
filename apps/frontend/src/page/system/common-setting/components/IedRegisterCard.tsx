import { KeyOutlined, SafetyOutlined } from '@ant-design/icons'
import { ModalForm, ProCard, ProFormText } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Descriptions, Space, Spin, message } from 'antd'
import { FC } from 'react'

import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'

interface FormState {
  license: string
}

export const IedRegisterCard: FC = () => {
  // ----------------------------- React-Query -----------------------------
  const setLicenseMutation = useMutation({
    mutationFn: systemApi.setLicense
  })
  const licenseHashQuery = useQuery({
    queryKey: [QueryKey.LicenseHash],

    queryFn: () => systemApi.getLicenseHash()
  })
  const licenseQuery = useQuery({
    queryKey: [QueryKey.License],

    queryFn: () => systemApi.getLicense()
  })
  const licenseHash = licenseHashQuery.data?.data.data.licenseHash
  const license = licenseQuery.data?.data.data.license

  const confirmLoading = setLicenseMutation.isPending
  const formLoading = confirmLoading || licenseHashQuery.isLoading
  const loading = licenseHashQuery.isLoading || licenseQuery.isLoading

  // ----------------------------- Method -----------------------------
  const handleSubmit = async (values: FormState) => {
    const { license } = values

    await setLicenseMutation.mutateAsync(license)

    licenseQuery.refetch()
    message.success('IED 注册成功')
    return true
  }

  return (
    <ProCard
      extra={
        <ModalForm<FormState>
          isKeyPressSubmit={true}
          labelCol={{ span: 6 }}
          layout="horizontal"
          loading={confirmLoading}
          modalProps={{ destroyOnClose: true }}
          title="IED注册"
          trigger={
            <Button size="small" type="text">
              <KeyOutlined />
            </Button>
          }
          width={520}
          onFinish={handleSubmit}
        >
          <Spin spinning={formLoading}>
            <ProFormText
              fieldProps={{ value: licenseHash }}
              label="主机源 HASH"
              readonly={true}
            />
            <ProFormText
              label="验证 license"
              name="license"
              rules={[
                {
                  required: true,
                  message: '请输入验证 License'
                }
              ]}
            />
          </Spin>
        </ModalForm>
      }
      loading={loading}
      title={
        <Space>
          <SafetyOutlined />
          IED 注册
        </Space>
      }
    >
      <Descriptions items={[{ label: '主机源 HASH', children: licenseHash }]} />
      <Descriptions items={[{ label: '验证 license', children: license }]} />
    </ProCard>
  )
}

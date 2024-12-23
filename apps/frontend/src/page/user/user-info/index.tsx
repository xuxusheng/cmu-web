import { EditOutlined, SecurityScanOutlined } from '@ant-design/icons'
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProDescriptions,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Space, Tooltip, message } from 'antd'
import { FC } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useNavigate } from 'react-router'

import { QueryKey } from '../../../api/query-key.ts'
import { userApi } from '../../../api/user.ts'

interface UpdatePasswordFormState {
  oldPassword: string // 旧密码
  newPassword: string // 新密码
}

interface UpdateUserInfoFormState {
  username: string // 用户名
}

const UserInfo: FC = () => {
  const navigate = useNavigate()

  // ----------------------------- State -----------------------------
  // const systemStore = useSystemStore()
  const [updateUserInfoForm] = Form.useForm<UpdateUserInfoFormState>()

  // ----------------------------- React-Query -----------------------------
  const updatePasswordMutation = useMutation({
    mutationFn: userApi.updateMePassword
  })
  const updateUserInfoMutation = useMutation({
    mutationFn: userApi.updateMeUserInfo
  })
  const meQuery = useQuery({
    queryKey: [QueryKey.Me],
    queryFn: () => userApi.me()
  })
  const me = meQuery.data?.data.data

  // ----------------------------- Method -----------------------------

  const handleUpdateUserInfoModalOpenChange = (open: boolean) => {
    if (open && me) {
      updateUserInfoForm.setFieldsValue(me)
    }
  }

  const handleUpdatePassword = async (values: UpdatePasswordFormState) => {
    const { oldPassword, newPassword } = values

    await updatePasswordMutation.mutateAsync({
      oldPassword,
      newPassword
    })

    message.success('修改密码成功')
    return true
  }

  const handleUpdateUserInfo = async (values: UpdateUserInfoFormState) => {
    const { username } = values

    await updateUserInfoMutation.mutateAsync({
      username
    })

    message.success('修改用户信息成功')
    meQuery.refetch()
    return true
  }

  // ----------------------------- Render -----------------------------

  const renderUpdatePasswordModal = () => (
    <ModalForm<UpdatePasswordFormState>
      autoFocusFirstInput={true}
      isKeyPressSubmit={true}
      layout="horizontal"
      modalProps={{
        forceRender: true,
        destroyOnClose: true
      }}
      title="修改密码"
      trigger={
        <Tooltip title="修改密码">
          <Button size="small" type="text">
            <SecurityScanOutlined />
          </Button>
        </Tooltip>
      }
      width={400}
      onFinish={handleUpdatePassword}
    >
      <ProFormText
        label="旧密码"
        name="oldPassword"
        rules={[{ required: true, message: '请输入旧密码' }]}
      />
      <ProFormText
        label="新密码"
        name="newPassword"
        rules={[{ required: true, message: '请输入新密码' }]}
      />
    </ModalForm>
  )

  const renderUpdateUserInfoModal = () => (
    <ModalForm<UpdateUserInfoFormState>
      autoFocusFirstInput={true}
      form={updateUserInfoForm}
      isKeyPressSubmit={true}
      layout="horizontal"
      modalProps={{
        forceRender: false,
        destroyOnClose: true
      }}
      title="修改用户信息"
      trigger={
        <Tooltip title="修改用户信息">
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Tooltip>
      }
      width={400}
      onFinish={handleUpdateUserInfo}
      onOpenChange={handleUpdateUserInfoModalOpenChange}
    >
      <ProFormText
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      />
    </ModalForm>
  )

  return (
    <PageContainer title="个人信息" onBack={() => navigate(-1)}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <ProCard
          extra={
            <Space>
              {renderUpdatePasswordModal()}
              {renderUpdateUserInfoModal()}
            </Space>
          }
          loading={meQuery.isLoading}
          title="基础信息"
        >
          <ProDescriptions size="small">
            <ProDescriptions.Item label="ID">{me?.id}</ProDescriptions.Item>
            <ProDescriptions.Item label="用户名">
              {me?.username}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="是否管理员">
              {me?.isAdmin ? '是' : '否'}
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>

        {/*<ProCard title="偏好设置">*/}
        {/*  <ProDescriptions size="small">*/}
        {/*    <ProDescriptions.Item label="白天/黑夜模式">*/}
        {/*      <DarkModeToggle*/}
        {/*        isDarkMode={systemStore.theme === 'dark'}*/}
        {/*        size="48px"*/}
        {/*        speed={2}*/}
        {/*        onChange={(isDarkMode: boolean) => {*/}
        {/*          systemStore.setTheme(isDarkMode ? 'dark' : 'light')*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </ProDescriptions.Item>*/}
        {/*  </ProDescriptions>*/}
        {/*</ProCard>*/}
      </Space>
    </PageContainer>
  )
}

export default UserInfo

import {
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal, Spin, message } from 'antd'
import { FC, useEffect, useMemo, useRef } from 'react'

import { i2ConfigApi } from '../../../api/i2-config.ts'
import { QueryKey } from '../../../api/query-key.ts'
import { CreateCagDto } from '../../../interface/i2-config.ts'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  id?: number
}

type FormState = CreateCagDto

export const UpsertCagModal: FC<Props> = (props) => {
  const { open, setOpen, id } = props
  const queryClient = useQueryClient()

  // ----------------------------- State -----------------------------
  const formRef = useRef<ProFormInstance<FormState>>()

  // ----------------------------- React-Query -----------------------------
  const createCagMutation = useMutation({
    mutationFn: i2ConfigApi.createCag
  })
  const updateCagMutation = useMutation({
    mutationFn: i2ConfigApi.updateCag
  })
  const cagQuery = useQuery({
    queryKey: [QueryKey.CagConfig, id],
    queryFn: () => i2ConfigApi.getCag(id!),
    enabled: !!id
  })
  const cag = cagQuery.data?.data.data

  useEffect(() => {
    if (!cag) {
      return
    }
    formRef.current?.setFieldsValue(cag)
  }, [cag])

  // ----------------------------- UseMemo -----------------------------
  const title = useMemo(() => (id ? '更新 CAG 配置' : '添加 CAG 配置'), [id])
  const confirmLoading = useMemo(
    () => createCagMutation.isPending || updateCagMutation.isPending,
    [createCagMutation.isPending, updateCagMutation.isPending]
  )
  const loading = useMemo(
    () => cagQuery.isFetching || confirmLoading,
    [cagQuery.isFetching, confirmLoading]
  )

  // ----------------------------- Method -----------------------------

  const handleCancel = () => {
    setOpen(false)
  }

  const handleOk = async () => {
    const form = formRef.current

    if (!form || loading) {
      return
    }

    await form.validateFields()

    const values = form.getFieldsValue()

    if (id) {
      await updateCagMutation.mutateAsync({
        ...values,
        cagId: id
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.CagConfig, id]
      })
    } else {
      await createCagMutation.mutateAsync(values)
    }

    queryClient.invalidateQueries({
      queryKey: [QueryKey.CagConfigList]
    })
    message.success(`${title}成功`)

    setOpen(false)
    return true
  }

  // ----------------------------- Render -----------------------------

  return (
    <Modal
      confirmLoading={confirmLoading}
      destroyOnClose={true}
      open={open}
      title={title}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Spin spinning={loading}>
        <ProForm<FormState>
          formRef={formRef}
          isKeyPressSubmit={true}
          labelCol={{
            span: 5
          }}
          layout="horizontal"
          submitter={false}
          onFinish={handleOk}
        >
          <ProFormText
            label="IP 地址"
            name="cagIp"
            rules={[
              { required: true, message: 'IP 地址不能为空' },
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
            label="端口号"
            name="cagPort"
            rules={[{ required: true, message: '端口号不能为空' }]}
          />

          <ProFormText
            label="服务地址"
            name="cagServiceLocate"
            rules={[{ required: true, message: '服务地址不能为空' }]}
          />

          <ProFormText
            label="命名空间"
            name="cagNamespace"
            rules={[{ required: true, message: '命名空间不能为空' }]}
          />

          <ProFormDigit
            label="超时时间"
            name="timeoutTime"
            rules={[{ required: true, message: '超时时间不能为空' }]}
          />
        </ProForm>
      </Spin>
    </Modal>
  )
}

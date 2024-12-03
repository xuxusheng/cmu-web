import {
  ProForm,
  ProFormInstance,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal, Spin, message } from 'antd'
import * as ipAddr from 'ipaddr.js'
import { FC, useEffect, useRef } from 'react'

import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'
import { UpdateIpAddressDto } from '../../../../interface/system.ts'

interface Props {
  open: boolean
  ifname?: string // 网卡名称
  onOk?: () => void
  onCancel?: () => void
}

type FormState = UpdateIpAddressDto

export const UpdateNetworkModal: FC<Props> = (props) => {
  const { open, ifname, onOk, onCancel } = props
  const queryClient = useQueryClient()

  // ----------------------------- State -----------------------------
  const [modal, contextHolder] = Modal.useModal()
  const formRef = useRef<ProFormInstance<FormState>>()

  // ----------------------------- React-Query -----------------------------
  const updateMutation = useMutation({
    mutationFn: systemApi.updateIpAddress
  })
  const ipAddressQuery = useQuery({
    queryKey: [QueryKey.SystemIpAddressByName, ifname],
    queryFn: () => systemApi.getIpAddressByName(ifname!),
    enabled: !!ifname
  })
  const ipAddress = ipAddressQuery.data?.data.data
  useEffect(() => {
    if (!ipAddress) {
      return
    }

    const addrInfo = ipAddress[0]?.addr_info.find((v) => v.family === 'inet')

    if (!addrInfo) {
      return
    }

    const ip = addrInfo.local
    const prefixlen = addrInfo.prefixlen

    formRef.current?.setFieldsValue({
      ip,
      netmask: ipAddr.IPv4.subnetMaskFromPrefixLength(prefixlen).toString()
    })
  }, [ipAddress])

  const ipRouteQuery = useQuery({
    queryKey: [QueryKey.SystemIpRoute],
    queryFn: () => systemApi.getIpRoute(),
    enabled: !!ifname
  })
  const ipRoute = ipRouteQuery.data?.data.data
  useEffect(() => {
    if (!ipRoute) {
      return
    }

    const gateway = ipRoute.find((v) => v.dev === ifname && v.gateway)?.gateway

    if (gateway) {
      formRef.current?.setFieldsValue({ gateway })
    }
  }, [ifname, ipRoute])

  const confirmLoading = updateMutation.isPending
  const loading =
    ipAddressQuery.isFetching || ipRouteQuery.isFetching || confirmLoading

  // ----------------------------- Method -----------------------------
  const handleCancel = () => {
    onCancel?.()
  }

  const handleOk = async () => {
    const form = formRef.current

    if (!form || loading || !ifname) {
      return
    }

    await form.validateFields()

    // 二次确认一下
    const result = await modal.confirm({
      title: '请再次确认网络配置，避免设置后无法连接！'
    })

    if (result) {
      const values = form.getFieldsValue()
      console.log('表单提交', values)

      const { ip, netmask, gateway } = values

      await updateMutation.mutateAsync({ ifname, ip, netmask, gateway })

      message.success('更新网卡信息成功')

      onOk?.()
      queryClient.invalidateQueries({
        queryKey: [QueryKey.SystemIpAddressByName, ifname]
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.SystemIpRoute]
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.SystemIpAddress]
      })
    }

    return true
  }

  return (
    <Modal
      confirmLoading={confirmLoading}
      destroyOnClose={true}
      open={open}
      title="更新网卡信息"
      width={400}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      {contextHolder}
      <Spin spinning={loading}>
        <ProForm<FormState>
          formRef={formRef}
          labelCol={{ span: 6 }}
          layout="horizontal"
          submitter={false}
          onFinish={handleOk}
        >
          <ProFormText
            disabled={true}
            fieldProps={{ value: ifname }}
            label="网卡名称"
            name="ifname"
          />
          <ProFormText
            label="IP 地址"
            name="ip"
            rules={[
              {
                required: true,
                pattern:
                  /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/g,
                message: '请输入正确的 IP 地址'
              }
            ]}
          />
          <ProFormText
            label="子网掩码"
            name="netmask"
            rules={[
              {
                required: true,
                pattern:
                  /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/g,
                message: '请输入正确的子网掩码'
              }
            ]}
          />
          <ProFormText
            label="网关地址"
            name="gateway"
            rules={[
              {
                required: true,
                pattern:
                  /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/g,
                message: '请输入正确的网关地址'
              }
            ]}
          />
        </ProForm>
      </Spin>
    </Modal>
  )
}

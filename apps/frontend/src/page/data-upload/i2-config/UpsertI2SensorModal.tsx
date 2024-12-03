import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Form, Modal, Spin, message } from 'antd'
import { FC, useEffect, useMemo, useRef } from 'react'

import { i2SensorApi } from '../../../api/i2-sensor.ts'
import { QueryKey } from '../../../api/query-key.ts'
import { sensorApi } from '../../../api/sensor.ts'
import { CreateI2SensorDto } from '../../../interface/i2-sensor.ts'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  id?: number
  onOk?: () => void
  onCancel?: () => void
}

type FormState = CreateI2SensorDto

export const UpsertI2SensorModal: FC<Props> = (props) => {
  const { open, setOpen, id, onOk, onCancel } = props
  const queryClient = useQueryClient()

  // ----------------------------- State -----------------------------
  const formRef = useRef<ProFormInstance<FormState>>()
  const [form] = Form.useForm<FormState>()
  // 选中的分组
  const selectedGroupId = Form.useWatch('groupId', form)

  // ----------------------------- React-Query -----------------------------
  const createMutation = useMutation({
    mutationFn: i2SensorApi.create
  })
  const updateMutation = useMutation({ mutationFn: i2SensorApi.update })

  // 查询 I2 传感器详情，写入表单
  const i2SensorQuery = useQuery({
    queryKey: [QueryKey.I2Sensor, id],
    queryFn: () => i2SensorApi.getById(id!),
    enabled: !!id
  })
  const i2Sensor = i2SensorQuery.data?.data.data

  useEffect(() => {
    if (!i2Sensor) {
      return
    }
    formRef.current?.setFieldsValue(i2Sensor)
  }, [i2Sensor])

  // 查询分组信息
  const i2GroupsQuery = useQuery({
    queryKey: [QueryKey.I2Groups],

    queryFn: () => i2SensorApi.getAllGroup()
  })
  const i2Groups = i2GroupsQuery.data?.data.data || []

  // 查询相别信息
  const i2PhasesQuery = useQuery({
    queryKey: [QueryKey.I2Phases],

    queryFn: () => i2SensorApi.getAllPhase()
  })
  const i2Phases = (i2PhasesQuery.data?.data.data || []).filter(
    (phase) => !!phase.name
  )

  // 根据所选分组，查询该分组下的传感器
  const selectedGroupLnClass = useMemo(
    () => i2Groups.find((group) => group.id === selectedGroupId)?.lnClass,
    [i2Groups, selectedGroupId]
  )
  const sensorListQuery = useQuery({
    queryKey: [QueryKey.Sensors, { lnClass: selectedGroupLnClass }],
    queryFn: () =>
      sensorApi.list({
        lnClass: selectedGroupLnClass
      }),
    enabled: !!selectedGroupLnClass
  })

  const sensorOptions = sensorListQuery.data?.data.data.map((sensor) => ({
    label: `${sensor.descCn}(${sensor.lnInst})`,
    value: sensor.lnInst
  }))

  const confirmLoading = createMutation.isPending || updateMutation.isPending
  const loading = i2SensorQuery.isFetching || confirmLoading

  // ----------------------------- UseMemo -----------------------------
  const title = useMemo(
    () => (id ? '更新 I2 传感器配置' : '添加 I2 传感器配置'),
    [id]
  )

  //  ----------------------------- Effect -----------------------------
  useEffect(() => {
    if (!open) {
      // 如果试用了 useForm，弹窗关闭是表单没有自动销毁，手动重置一下（不知道什么原因）
      form.resetFields()
    }
  }, [form, open])

  // ----------------------------- Method -----------------------------
  const handleSelectedGroupIdChange = (value?: number) => {
    // 选中的分组变化时，将选中的传感器清空
    form.setFieldsValue({
      lnInst: undefined
    })

    if (!value) {
      form.validateFields()
    }
  }

  const handleSelectedSensorChange = (value?: string) => {
    // 选中的传感器设备变化时，将选中的传感器名称自动填充到设备描述字段
    const sensor = sensorListQuery.data?.data.data.find(
      (sensor) => sensor.lnInst === value
    )
    form.setFieldsValue({
      descCn: sensor?.descCn
    })
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel?.()
  }

  const handleOk = async () => {
    const form = formRef.current

    if (!form || loading) {
      return
    }

    await form.validateFields()

    const values = form.getFieldsValue()

    console.log('表单提交', values)

    if (id) {
      await updateMutation.mutateAsync({
        id,
        ...values
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.I2Sensor, id]
      })
    } else {
      await createMutation.mutateAsync(values)
    }

    queryClient.invalidateQueries({
      queryKey: [QueryKey.I2SensorPage]
    })
    message.success(`${title}成功`)

    setOpen(false)
    onOk?.()
    return true
  }

  return (
    <Modal
      confirmLoading={confirmLoading}
      destroyOnClose={true}
      open={open}
      title={title}
      width={520}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Spin spinning={loading}>
        <ProForm<FormState>
          form={form}
          formRef={formRef}
          isKeyPressSubmit={true}
          labelCol={{ span: 7 }}
          layout="horizontal"
          submitter={false}
          onFinish={handleOk}
        >
          <ProFormText
            label="传感器编码"
            name="code"
            rules={[{ required: true, message: '请输入传感器编码' }]}
          />
          <ProFormSelect
            fieldProps={{
              loading: i2GroupsQuery.isLoading
            }}
            label="组名"
            name="groupId"
            options={i2Groups.map((group) => ({
              label: group.name,
              value: group.id,
              disabled: !group.lnClass?.trim()
            }))}
            rules={[{ required: true, message: '请选择组名' }]}
            showSearch={true}
            onChange={handleSelectedGroupIdChange}
          />
          <ProFormSelect
            fieldProps={{
              loading: sensorListQuery.isLoading
            }}
            label="传感器名称"
            name="lnInst"
            options={sensorOptions}
            rules={[{ required: true, message: '请选择传感器名称' }]}
            onChange={handleSelectedSensorChange}
          />
          <ProFormText
            label="I2 设备描述"
            name="descCn"
            rules={[{ required: true, message: '请输入 I2 设备描述' }]}
          />
          <ProFormText
            label="一次设备编码"
            name="equipmentId"
            rules={[{ required: true, message: '请输入一次设备编码' }]}
          />
          <ProFormDigit
            label="数据上传周期(min)"
            name="dataUploadPeriod"
            rules={[{ required: true, message: '请输入数据上传周期' }]}
          />
          <ProFormDateTimePicker
            dataFormat={'YYYY-MM-DD HH:mm'}
            fieldProps={{
              format: 'YYYY-MM-DD HH:mm'
            }}
            label="下次上传时间"
            name="nextDataUploadTime"
            rules={[{ required: true, message: '请选择下次上传时间' }]}
            width="lg"
          />
          <ProFormSelect
            label="相别"
            name="phaseId"
            options={i2Phases.map((phase) => ({
              label: phase.name,
              value: phase.id
            }))}
            rules={[{ required: true, message: '请选择相别' }]}
          />
        </ProForm>
      </Spin>
    </Modal>
  )
}

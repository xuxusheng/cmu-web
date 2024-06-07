import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Col,
  Divider,
  Drawer,
  Empty,
  Row,
  Space,
  Spin,
  message
} from 'antd'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { QueryKey } from '../../../api/query-key.ts'
import { sensorApi } from '../../../api/sensor.ts'

interface Props {
  id?: number // 更新模式下，需要传入设备 id
  open: boolean
  setOpen: (open: boolean) => void
  onOk?: () => void
  onCancel?: () => void
}

interface FormState {
  lnClass?: string // 设备类型
  sensorType?: string // 设备型号
  commType?: number // 通信类型
  descCn: string // 设备描述
  lnInst: string // 设备号
  sAddr: string // 短地址

  [key: string]: string | number | undefined
}

const initialFormState: FormState = {
  lnClass: undefined,
  sensorType: undefined,
  commType: undefined,
  descCn: '',
  lnInst: '',
  sAddr: ''
}

export const UpsertSensorDrawer: FC<Props> = (props) => {
  const { id, open, setOpen, onOk, onCancel } = props
  const queryClient = useQueryClient()

  // ------------------- State -------------------
  const formRef = useRef<ProFormInstance<FormState>>()

  // 选中的设备类型
  const [selectedLnClass, setSelectedLnClass] = useState<string>()
  // 选中的设备型号
  const [selectedSensorType, setSelectedSensorType] = useState<string>()

  // ------------------- React-Query -------------------
  const createMutation = useMutation({
    mutationFn: sensorApi.create
  })
  const updateMutation = useMutation({ mutationFn: sensorApi.update })

  // 设备类型可选项
  const lnClassOptionsQuery = useQuery({
    queryFn: sensorApi.getLnClassOptions,
    queryKey: [QueryKey.LnClassOptions]
  })
  // 设备型号可选项
  const sensorTypeOptionsQuery = useQuery({
    queryFn: () => sensorApi.getSensorTypeOptions(selectedLnClass),
    queryKey: [QueryKey.SensorTypeOptions, selectedLnClass],
    enabled: !!(open && selectedLnClass)
  })

  useEffect(() => {
    const options = sensorTypeOptionsQuery.data?.data.data

    const form = formRef.current

    if (!form || !options) {
      return
    }

    // 当切换设备类型时，会重新请求设备型号
    // 如果之前选择的设备型号已经不在新的设备型号列表中，需要清空设备型号
    const { sensorType } = form.getFieldsValue()
    if (sensorType && !options.find((option) => option.value === sensorType)) {
      form?.setFieldsValue({
        sensorType: undefined
      })
    }
  }, [sensorTypeOptionsQuery.data?.data.data])

  // 通信类型可选项
  const commTypeOptionsQuery = useQuery({
    queryKey: [QueryKey.CommTypeOptions],
    queryFn: sensorApi.getCommTypeOptions,
    enabled: open
  })

  // 设备额外属性
  const sensorAttrsQuery = useQuery({
    queryKey: [QueryKey.SensorAttrs, selectedLnClass, selectedSensorType],
    queryFn: () =>
      sensorApi.getSensorAttrs({
        lnClass: selectedLnClass!,
        sensorType: selectedSensorType!
      }),
    enabled: !!(selectedLnClass && selectedSensorType),
    gcTime: 1000 * 60
  })

  useEffect(() => {
    const form = formRef.current
    const attrs = sensorAttrsQuery.data?.data.data

    if (!form || !attrs) {
      return
    }

    attrs.forEach(({ key, defaultValue }) => {
      const value = form.getFieldValue(key)
      if (!value) {
        form.setFieldsValue({
          [key]: defaultValue
        })
      }
    })
  }, [sensorAttrsQuery.data?.data.data])

  const sensorQuery = useQuery({
    queryKey: [QueryKey.Sensor, id],
    queryFn: () => sensorApi.findById(id!),
    enabled: !!(open && id)
  })

  useEffect(() => {
    const data = sensorQuery.data?.data.data

    if (!data) {
      return
    }

    const { lnClass, sensorType, commType, descCn, lnInst, sAddr, attrs } = data
    const form = formRef.current
    if (!form) {
      return
    }

    form.setFieldsValue({
      lnClass,
      sensorType,
      commType,
      descCn,
      lnInst,
      sAddr
    })

    attrs.forEach(({ key, value }) => {
      form.setFieldsValue({
        [key]: value
      })
    })

    setSelectedLnClass(lnClass)
    setSelectedSensorType(sensorType)
  }, [sensorQuery.data?.data.data])

  // ------------------- UseMemo -------------------
  const title = useMemo(() => (id ? '更新设备信息' : '添加设备'), [id])

  const lnClassOptions = useMemo(
    () => lnClassOptionsQuery.data?.data.data || [],
    [lnClassOptionsQuery.data]
  )

  const commTypeOptions = useMemo(
    () => commTypeOptionsQuery.data?.data.data || [],
    [commTypeOptionsQuery.data]
  )

  const sensorTypeOptions = useMemo(
    () => sensorTypeOptionsQuery.data?.data.data || [],
    [sensorTypeOptionsQuery.data]
  )

  const sensorAttrs = useMemo(
    () => sensorAttrsQuery.data?.data.data || [],
    [sensorAttrsQuery.data]
  )

  const confirmLoading = createMutation.isPending || updateMutation.isPending
  const loading = confirmLoading || sensorQuery.isLoading

  // ------------------- Effect -------------------
  useEffect(() => {
    if (!open) {
      formRef.current?.resetFields()
      setSelectedLnClass(undefined)
      setSelectedSensorType(undefined)
    }
  }, [open, sensorAttrsQuery])

  // ------------------- Method -------------------

  const handleCancel = () => {
    setOpen(false)
    onCancel?.()
  }

  const handleOk = async () => {
    const form = formRef.current

    if (!form || confirmLoading) {
      return
    }

    await form.validateFields()

    const { lnClass, sensorType, commType, descCn, lnInst, sAddr, ...rest } =
      form.getFieldsValue()

    const attrs = sensorAttrs.map(({ key }) => ({
      key,
      value: rest[key] as string
    }))

    const data = {
      lnClass: lnClass!,
      sensorType: sensorType!,
      commType: commType!,
      descCn,
      lnInst,
      sAddr,
      attrs
    }

    if (id) {
      // 更新模式
      await updateMutation.mutateAsync({
        id,
        ...data
      })
      queryClient.invalidateQueries({ queryKey: [QueryKey.Sensor, id] })
    } else {
      // 新建模式
      await createMutation.mutateAsync(data)
    }

    message.success(id ? '设备信息更新成功' : '设备添加成功')
    queryClient.invalidateQueries({ queryKey: [QueryKey.SensorPage] })
    setOpen(false)
    onOk?.()
  }

  return (
    <Drawer
      destroyOnClose={true}
      extra={
        <Space>
          <Button disabled={confirmLoading} onClick={handleCancel}>
            取消
          </Button>
          <Button loading={confirmLoading} type="primary" onClick={handleOk}>
            提交
          </Button>
        </Space>
      }
      open={open}
      title={title}
      width={640}
      onClose={handleCancel}
    >
      <Spin spinning={loading}>
        <ProForm<FormState>
          autoComplete="off"
          formRef={formRef}
          initialValues={initialFormState}
          isKeyPressSubmit={true}
          loading={loading}
          submitter={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Divider>基础信息</Divider>
              <ProFormSelect
                fieldProps={{
                  loading: lnClassOptionsQuery.isLoading
                }}
                label="设备类型"
                name="lnClass"
                options={lnClassOptions}
                rules={[{ required: true, message: '请选择设备类型' }]}
                onChange={(value) => {
                  if (!value) {
                    formRef.current?.setFieldsValue({
                      sensorType: undefined
                    })
                  }

                  setSelectedLnClass(value as string | undefined)
                }}
              />

              <ProFormSelect
                fieldProps={{
                  loading: sensorTypeOptionsQuery.isLoading,
                  placeholder: selectedLnClass ? '请选择' : '请先选择设备类型'
                }}
                label="设备型号"
                name="sensorType"
                options={sensorTypeOptions}
                rules={[{ required: true, message: '请选择设备型号' }]}
                onChange={(value) =>
                  setSelectedSensorType(value as string | undefined)
                }
              />

              <ProFormSelect
                fieldProps={{
                  loading: commTypeOptionsQuery.isLoading
                }}
                label="通信类型"
                name="commType"
                options={commTypeOptions}
                rules={[{ required: true, message: '请选择通信类型' }]}
              />

              <ProFormText
                label="设备号"
                name="lnInst"
                rules={[
                  { required: true, message: '请输入设备号' },
                  { pattern: /^\d+$/, message: '设备号只能由数字组成' }
                ]}
              />

              <ProFormText
                label="短地址"
                name="sAddr"
                rules={[
                  { required: true, message: '请输入短地址' },
                  { pattern: /^\d+$/, message: '短地址只能由数字组成' }
                ]}
              />

              <ProFormTextArea
                label="设备描述"
                name="descCn"
                rules={[{ required: true, message: '请输入设备描述' }]}
              />
            </Col>
            <Col
              span={12}
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Divider>其他属性</Divider>

              <Spin spinning={sensorAttrsQuery.isLoading}>
                {sensorAttrs.length === 0 && (
                  <Empty
                    description="请选择设备类型和设备型号"
                    style={{ marginTop: '100px' }}
                  />
                )}
                {sensorAttrs.map(({ key, label, defaultValue }) => (
                  <ProFormText
                    fieldProps={{
                      defaultValue: defaultValue,
                      onPressEnter: handleOk
                    }}
                    key={key}
                    label={label}
                    name={key}
                    rules={[
                      {
                        required: true,
                        message: '属性值不能为空'
                      }
                    ]}
                  />
                ))}
              </Spin>
            </Col>
          </Row>
        </ProForm>
      </Spin>
    </Drawer>
  )
}

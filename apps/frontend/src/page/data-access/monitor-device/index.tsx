import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {
  ActionType,
  FormInstance,
  PageContainer,
  ProColumns,
  ProTable
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Modal, Space, Tooltip, message } from 'antd'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { QueryKey } from '../../../api/query-key.ts'
import { sensorApi } from '../../../api/sensor.ts'
import { SensorVO } from '../../../interface/sensor.ts'
import { UpsertSensorDrawer } from './UpsertSensorDrawer.tsx'

interface FormState {
  sensorType: string
  lnClass: string
  commType: string
}

// 监测设备管理页面
const MonitorDevicePage: FC = () => {
  const navigate = useNavigate()
  const [modal, contextHolder] = Modal.useModal()

  // ------------------- State -------------------
  const actionRef = useRef<ActionType>()
  const formRef = useRef<FormInstance<FormState>>()
  const [upsertSensorDrawerProps, setUpsertSensorDrawerProps] = useState<{
    id?: number
    open: boolean
  }>({
    open: false
  })

  // 选中的设备类型
  const [selectedLnClass, setSelectedLnClass] = useState<string>()

  // ------------------- React-Query -------------------
  const deleteMutation = useMutation({ mutationFn: sensorApi.delete })
  // 设备类型可选项
  const lnClassOptionsQuery = useQuery({
    queryKey: [QueryKey.LnClassOptions],
    queryFn: sensorApi.getLnClassOptions
  })
  // 设备型号可选项
  const sensorTypeOptionsQuery = useQuery({
    queryKey: [QueryKey.SensorTypeOptions, selectedLnClass],
    queryFn: () => sensorApi.getSensorTypeOptions(selectedLnClass),
    enabled: !!selectedLnClass
  })

  useEffect(() => {
    const options = sensorTypeOptionsQuery.data?.data.data
    const form = formRef.current

    if (!form || !options) {
      return
    }

    // 当切换设备类型时，会重新请求设备型号
    // 如果之前选择的设备型号已经不在新的设备型号列表中，需要清空设备型号
    const sensorType = form.getFieldValue('sensorType')
    if (sensorType && !options.find((option) => option.value === sensorType)) {
      form.setFieldsValue({
        sensorType: undefined
      })
    }
  }, [])

  // 通信类型可选项
  const commTypeOptionsQuery = useQuery({
    queryKey: [QueryKey.CommTypeOptions],
    queryFn: sensorApi.getCommTypeOptions
  })

  // ------------------- UseMemo -------------------
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

  // ------------------- Method -------------------
  const handleDelete = (id: number) => {
    modal.confirm({
      title: '删除设备',
      content: '删除后无法恢复，确定删除？',
      onOk: async () => {
        await deleteMutation.mutateAsync(id)
        message.success('删除设备成功')
        actionRef.current?.reload()
        return true
      }
    })
  }

  // ------------------- Render -------------------
  const columns: ProColumns<SensorVO>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48
    },
    {
      title: '设备类型',
      dataIndex: 'lnClass',
      valueType: 'select',
      fieldProps: {
        loading: lnClassOptionsQuery.isLoading,
        options: lnClassOptions,
        onChange: (value: string) => {
          // 清空
          if (!value) {
            formRef.current?.setFieldsValue({
              sensorType: undefined
            })
          }

          setSelectedLnClass(value)
        }
      }
    },
    {
      title: '设备型号',
      dataIndex: 'sensorType',
      valueType: 'select',
      fieldProps: {
        placeholder: selectedLnClass ? '请选择' : '请先选择设备类型',
        loading: sensorTypeOptionsQuery.isLoading,
        options: sensorTypeOptions
      }
    },
    {
      title: '通信类型',
      dataIndex: 'commType',
      valueType: 'select',
      search: false,
      fieldProps: {
        loading: commTypeOptionsQuery.isLoading,
        options: commTypeOptions
      }
    },
    {
      title: '设备描述',
      dataIndex: 'descCn',
      search: false
    },
    {
      title: '设备号',
      dataIndex: 'lnInst',
      width: 100,
      search: false
    },
    {
      title: '短地址',
      dataIndex: 'sAddr',
      width: 100,
      search: false
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 72,
      render: (_, entity) => [
        <Space key="main" size={0}>
          <Tooltip mouseEnterDelay={0.5} title="更新设备信息">
            <Button
              key="update"
              size="small"
              type="text"
              onClick={() =>
                setUpsertSensorDrawerProps({
                  open: true,
                  id: entity.id
                })
              }
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip mouseEnterDelay={0.5} title="删除设备">
            <Button
              key="del"
              size="small"
              type="text"
              onClick={() => handleDelete(entity.id)}
            >
              <DeleteOutlined style={{ color: '#ff4d4f' }} />
            </Button>
          </Tooltip>
        </Space>
      ]
    }
  ]

  return (
    <PageContainer
      breadcrumb={{
        items: [
          {
            path: '',
            title: <HomeOutlined />,
            onClick: () => navigate('/main/realtime-status')
          },
          { title: '南向设备' },
          { title: '监测设备管理' }
        ]
      }}
      title={false}
    >
      {contextHolder}
      <ProTable<SensorVO>
        actionRef={actionRef}
        columns={columns}
        formRef={formRef}
        pagination={{
          showSizeChanger: true
        }}
        request={async (params) => {
          const { current = 1, pageSize = 10 } = params

          const { sensorType, lnClass, commType } = params

          const res = await sensorApi.page({
            pn: current,
            ps: pageSize,
            sensorType,
            lnClass,
            commType
          })

          const { total, items } = res.data.data

          return {
            data: items,
            total,
            success: true
          }
        }}
        rowKey={(record) => record.id}
        scroll={{
          x: 'max-content'
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => setUpsertSensorDrawerProps({ open: true })}
          >
            <PlusOutlined />
            添加设备
          </Button>
        ]}
      />

      <UpsertSensorDrawer
        id={upsertSensorDrawerProps.id}
        key="create"
        open={upsertSensorDrawerProps.open}
        setOpen={(open) => setUpsertSensorDrawerProps({ open })}
        onOk={() => actionRef.current?.reload()}
      />
    </PageContainer>
  )
}

export default MonitorDevicePage

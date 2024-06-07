import {
  ClockCircleOutlined,
  EditOutlined,
  SyncOutlined
} from '@ant-design/icons'
import {
  ModalForm,
  ProCard,
  ProDescriptions,
  ProFormDateTimePicker
} from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Space, Tooltip, message } from 'antd'
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'
import { useInterval } from 'react-use'
import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'
import { useTimeTicker } from '../../../../hook/use-time-ticker.tsx'

interface FormState {
  systemTime: string
}

export const SystemTimeCard: FC = () => {
  const [localTime, setLocalTime] = useState(dayjs())
  const systemTimeTicker = useTimeTicker()

  useInterval(() => {
    setLocalTime(dayjs())
  }, 1000)

  // ----------------------------- React-Query -----------------------------
  const systemTimeQuery = useQuery({
    queryKey: [QueryKey.SystemTime],
    queryFn: () => systemApi.getSystemTime(),
    refetchInterval: 1000 * 60 // 每分钟校准一次
  })
  const updateSystemTimeMutation = useMutation({
    mutationFn: systemApi.setSystemTime
  })
  const syncSystemTimeMutation = useMutation({
    mutationFn: () => systemApi.setSystemTime(dayjs())
  })

  useEffect(() => {
    if (systemTimeQuery.data) {
      const systemTime = dayjs(systemTimeQuery.data.data.data.systemTime)
      systemTimeTicker.setTime(systemTime)
    }
  }, [systemTimeQuery.data, systemTimeTicker.setTime])

  // ----------------------------- Method -----------------------------
  const handleUpdateSystemTime = async (values: FormState) => {
    const systemTime = dayjs(values.systemTime, 'YYYY-MM-DD HH:mm:ss')
    await updateSystemTimeMutation.mutateAsync(systemTime)

    message.success('IED 时间修改成功')
    systemTimeQuery.refetch()
    return true
  }

  // 直接将本地时间同步到系统时间
  const handleSyncSystemTime = async () => {
    if (syncSystemTimeMutation.isPending) {
      return
    }

    await syncSystemTimeMutation.mutateAsync()

    message.success('IED 时间同步成功')
    systemTimeQuery.refetch()
  }

  return (
    <ProCard
      extra={
        <Space>
          <Tooltip title="同步本地时间到 IED">
            <Button size="small" type="text" onClick={handleSyncSystemTime}>
              <SyncOutlined spin={syncSystemTimeMutation.isPending} />
            </Button>
          </Tooltip>

          <ModalForm<FormState>
            isKeyPressSubmit={true}
            layout="horizontal"
            modalProps={{ destroyOnClose: true }}
            title="修改 IED 时间"
            trigger={
              <Button size="small" type="text">
                <EditOutlined />
              </Button>
            }
            width={520}
            onFinish={handleUpdateSystemTime}
          >
            <div>
              <ProFormDateTimePicker
                dataFormat=""
                fieldProps={{ style: { width: '100%' } }}
                label="时间"
                name="systemTime"
                required
                rules={[{ required: true, message: '请输入系统时间' }]}
              />
            </div>
          </ModalForm>
        </Space>
      }
      style={{
        minHeight: 141
      }}
      title={
        <Space>
          <ClockCircleOutlined />
          时间设置
        </Space>
      }
    >
      <ProDescriptions
        column={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 2,
          xxl: 2
        }}
      >
        <ProDescriptions.Item label="本地时间">
          {localTime.format('YYYY-MM-DD HH:mm:ss')}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="IED 时间">
          {systemTimeTicker.time?.format('YYYY-MM-DD HH:mm:ss')}
        </ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
  )
}

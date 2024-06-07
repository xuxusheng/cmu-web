import { DownOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Select,
  Space,
  Tooltip,
  message
} from 'antd'
import { throttle } from 'lodash-es'
import { FC, useRef, useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import { Socket, io } from 'socket.io-client'
import { i2SensorDebugApi } from '../../../api/i2-sensor-debug.ts'
import { i2SensorApi } from '../../../api/i2-sensor.ts'
import { QueryKey } from '../../../api/query-key.ts'
import styles from './I2LogCard.module.scss'
export const I2LogCard: FC = () => {
  // ----------------------------- State -----------------------------
  const socketRef = useRef<Socket>()
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedI2SensorId, setSelectedI2SensorId] = useState<number>()

  // 日志变化时，是否自动滚动到最下面
  const autoScroll = useRef(true)
  const [log, setLog] = useState('')

  // ----------------------------- React-Query -----------------------------
  const sendCommandMutation = useMutation({
    mutationFn: i2SensorDebugApi.sendCommand
  })
  const i2SensorsQuery = useQuery({
    queryKey: [QueryKey.I2Sensors],

    queryFn: () => i2SensorApi.list()
  })
  const i2Sensors = i2SensorsQuery.data?.data.data || []
  const i2SensorOptions = i2Sensors.map((option) => ({
    label: option.descCn,
    value: option.id
  }))

  const i2SensorDebugCommandsQuery = useQuery({
    queryKey: [QueryKey.I2SensorDebugCommands],
    queryFn: () => i2SensorDebugApi.getCommand()
  })
  const i2SensorDebugCommands = i2SensorDebugCommandsQuery.data?.data.data || []
  const i2SensorDebugCommandsOptions = i2SensorDebugCommands?.map(
    (command) => ({
      label: command.label,
      key: command.value
    })
  )

  // ----------------------------- Lifecycle -----------------------------
  useMount(() => {
    const socket = io({
      path: '/socket.io'
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('socket connected')
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })

    socket.on('connect_error', (error) => {
      console.log('socket connect error', error)
    })

    socket.on('tail-i2-log', (data) => {
      setLog((prev) => prev + data)

      if (autoScroll.current) {
        setTimeout(() => {
          scrollToBottom()
        })
      }
    })

    socket.on('tail-i2-log-error', (error) => {
      message.error(`获取日志失败：${error}`)
    })

    socket.emit('tail-i2-log', 100)
  })

  useUnmount(() => {
    socketRef.current?.disconnect()
  })

  // ----------------------------- Method -----------------------------
  // 滚动到最底部
  const scrollToBottom = () => {
    const container = containerRef.current
    if (!container) return

    const { scrollHeight, clientHeight } = container
    const scrollTop = scrollHeight - clientHeight

    container.scrollTo({ top: scrollTop, behavior: 'smooth' })
  }

  // 监听滚动事件
  const handleScroll = throttle(() => {
    const container = containerRef.current
    if (!container) return

    const { scrollHeight, scrollTop, clientHeight } = container
    autoScroll.current = scrollHeight - scrollTop <= clientHeight + 1
  }, 300)

  // 下发命令
  const handleSendCommand: MenuProps['onClick'] = async (menuInfo) => {
    if (!selectedI2SensorId || sendCommandMutation.isPending) {
      return
    }

    const key = menuInfo.key
    await sendCommandMutation.mutateAsync({
      i2SensorId: selectedI2SensorId,
      command: key
    })

    message.success('指令下发成功')
  }

  return (
    <ProCard
      className={styles.main}
      extra={
        <Flex gap="middle" wrap="wrap">
          <Select
            allowClear={true}
            loading={i2SensorsQuery.isLoading}
            optionFilterProp="label"
            options={i2SensorOptions}
            placeholder="请选择 I2 传感器"
            showSearch={true}
            style={{ width: 180 }}
            value={selectedI2SensorId}
            onChange={(value) => setSelectedI2SensorId(value)}
          />

          {selectedI2SensorId &&
          !i2SensorDebugCommandsQuery.isLoading &&
          !i2SensorDebugCommandsOptions.length ? (
            <Button disabled={true}>无可用指令</Button>
          ) : (
            <Dropdown
              disabled={!selectedI2SensorId}
              menu={{
                items: i2SensorDebugCommandsOptions,
                onClick: handleSendCommand
              }}
            >
              <Button
                loading={
                  i2SensorDebugCommandsQuery.isLoading ||
                  sendCommandMutation.isPending
                    ? { delay: 200 }
                    : false
                }
                type="primary"
              >
                指令下发
                <DownOutlined />
              </Button>
            </Dropdown>
          )}
        </Flex>
      }
      title="日志"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <div className={styles.toolbar}>
            <Tooltip mouseEnterDelay={0.5} title="滚动到底部">
              <Button size="small" onClick={scrollToBottom}>
                <VerticalAlignBottomOutlined />
              </Button>
            </Tooltip>
          </div>
          <div
            className={styles.logContainer}
            ref={containerRef}
            onScroll={() => handleScroll && handleScroll()}
          >
            {log}
          </div>
        </div>
      </Space>
    </ProCard>
  )
}

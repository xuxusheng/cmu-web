import { DownOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  Select,
  Space,
  Tooltip,
  message
} from 'antd'
import { groupBy, throttle } from 'lodash-es'
import { FC, useRef, useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import { Socket, io } from 'socket.io-client'
import { QueryKey } from '../../../api/query-key.ts'
import { sensorDebugApi } from '../../../api/sensor-debug.ts'
import { sensorApi } from '../../../api/sensor.ts'
import styles from './LogCard.module.scss'

export const LogCard: FC = () => {
  // ----------------------------- State -----------------------------
  const socketRef = useRef<Socket>()
  const containerRef = useRef<HTMLDivElement>(null)

  // 选中的设备 ID
  const [selectedSensorId, setSelectedSensorId] = useState<number>()

  // 参数
  const [args, setArgs] = useState<string>('')

  // 日志变化时，是否自动滚动到最下面
  const autoScroll = useRef(true)
  const [log, setLog] = useState('')

  // ----------------------------- React-Query -----------------------------
  const sendCommandMutation = useMutation({
    mutationFn: sensorDebugApi.sendCommand
  })
  const sensorsQuery = useQuery({
    queryKey: [QueryKey.Sensors],
    queryFn: () => sensorApi.list()
  })
  const sensors = sensorsQuery.data?.data.data || []
  // 按照 lnClassNameCn 字段分个组
  const sensorOptions = Object.entries(groupBy(sensors, 'lnClassNameCn')).map(
    ([label, options]) => ({
      label,
      options: options.map((option) => ({
        label: option.descCn,
        value: option.id
      }))
    })
  )

  const sensorDebugCommandsQuery = useQuery({
    queryKey: [QueryKey.SensorDebugCommands, selectedSensorId],
    queryFn: () => sensorDebugApi.getCommand(selectedSensorId!),
    enabled: !!selectedSensorId
  })
  const sensorDebugCommands = sensorDebugCommandsQuery.data?.data.data || []
  const sensorDebugCommandsOptions = sensorDebugCommands?.map((command) => ({
    label: command.label,
    key: command.value
  }))

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

    socket.on('tail-log', (data) => {
      setLog((prev) => prev + data)

      if (autoScroll.current) {
        setTimeout(() => {
          scrollToBottom()
        })
      }
    })

    socket.on('tail-log-error', (error) => {
      message.error(`获取日志失败：${error}`)
    })

    socket.emit('tail-log', 100)
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
    if (!selectedSensorId || sendCommandMutation.isPending) {
      return
    }

    const key = menuInfo.key
    await sendCommandMutation.mutateAsync({
      sensorId: selectedSensorId,
      command: key,
      args
    })

    message.success('指令下发成功')
  }

  return (
    <ProCard className={styles.main} title="采集程序日志">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex gap="middle" wrap="wrap">
          <Select
            allowClear={true}
            loading={sensorsQuery.isLoading}
            optionFilterProp="label"
            options={sensorOptions}
            placeholder="请选择传感器"
            showSearch={true}
            style={{ width: 180 }}
            value={selectedSensorId}
            onChange={(value) => setSelectedSensorId(value)}
          />

          <Input
            placeholder="请输入参数"
            style={{ width: 180 }}
            value={args}
            onChange={(e) => setArgs(e.target.value)}
          />

          {selectedSensorId &&
          !sensorDebugCommandsQuery.isLoading &&
          !sensorDebugCommandsOptions.length ? (
            <Button disabled={true}>无可用指令</Button>
          ) : (
            <Dropdown
              disabled={!selectedSensorId}
              menu={{
                items: sensorDebugCommandsOptions,
                onClick: handleSendCommand
              }}
            >
              <Button
                loading={
                  sensorDebugCommandsQuery.isLoading ||
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

import { DesktopOutlined, ReloadOutlined } from '@ant-design/icons'
import { ProCard, StatisticCard } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, message, Modal, Space, Tag, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { sum } from 'lodash-es'
import prettyBytes from 'pretty-bytes'
import { FC, useMemo } from 'react'
import { usePreviousDistinct } from 'react-use'

import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'

export const SystemStatusCard: FC = () => {
  // ----------------------------- React-Query -----------------------------
  const rebootMutation = useMutation({
    mutationFn: systemApi.reboot
  })
  const uptimeQuery = useQuery({
    queryKey: [QueryKey.SystemUptime],
    queryFn: () => systemApi.getUptime(),
    refetchInterval: 1000
  })

  const cpuQuery = useQuery({
    queryKey: [QueryKey.SystemCpu],
    queryFn: () => systemApi.getCpu(),
    refetchInterval: 1000
  })

  const memoryQuery = useQuery({
    queryKey: [QueryKey.SystemMemory],
    queryFn: () => systemApi.getMemory(),
    refetchInterval: 1000
  })
  const versionQuery = useQuery({
    queryKey: [QueryKey.SystemVersion],
    queryFn: () => systemApi.getVersion()
  })

  // ----------------------------- UseMemo -----------------------------
  const uptime = useMemo(
    () => uptimeQuery.data?.data.data.uptime,
    [uptimeQuery.data]
  )
  const cpu = useMemo(() => cpuQuery.data?.data.data, [cpuQuery.data])
  const prevCpu = usePreviousDistinct(cpu)
  const memory = useMemo(() => memoryQuery.data?.data.data, [memoryQuery.data])
  const version = useMemo(
    () => versionQuery.data?.data.data.version,
    [versionQuery]
  )

  // cpu 占用率
  const cpuUsedRate = useMemo(() => {
    if (!cpu || !prevCpu) {
      return
    }

    const total = sum(cpu.map(({ times }) => Object.values(times)).flat())
    const preTotal = sum(
      prevCpu.map(({ times }) => Object.values(times)).flat()
    )
    const idle = sum(cpu.map(({ times }) => times.idle))
    const preIdle = sum(prevCpu.map(({ times }) => times.idle))
    return (
      (100 - ((idle - preIdle) / (total - preTotal)) * 100).toFixed(2) + '%'
    )
  }, [cpu, prevCpu])

  // 内存占用率
  const memoryUsed = useMemo(() => {
    if (!memory) {
      return
    }

    const { free, total } = memory

    return `${prettyBytes(total - free, {
      binary: true
    })}/${prettyBytes(total, {
      binary: true
    })}`
  }, [memory])

  // ----------------------------- Method -----------------------------
  // 重启系统
  const handleReboot = () => {
    Modal.confirm({
      type: 'warning',
      title: '重启系统',
      content: '重启系统会导致服务一段时间内不可用，是否确定？',
      okButtonProps: {
        danger: true
      },
      onOk: async () => {
        await rebootMutation.mutateAsync()
        message.success('系统重启中，请等待几分钟后刷新页面')
      }
    })
  }

  // ----------------------------- Render -----------------------------

  const cardColSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 6
  }

  return (
    <ProCard
      extra={
        <Button danger={true} icon={<ReloadOutlined />} onClick={handleReboot}>
          重启系统
        </Button>
      }
      title={
        <Space>
          <DesktopOutlined />
          系统状态
          {version && (
            <Tag
              style={{ marginBottom: 3 }}
              color="processing"
              bordered={false}
            >
              {version}
            </Tag>
          )}
        </Space>
      }
    >
      <StatisticCard.Group wrap={true}>
        <StatisticCard
          colSpan={cardColSpan}
          statistic={{
            title: '系统运行时长',
            valueRender: () => (
              <Tooltip
                title={
                  uptime
                    ? dayjs
                        .duration(uptime, 'second')
                        .format('Y 年 M 个月 D 天 H 小时 m 分钟 s 秒')
                    : '-'
                }
              >
                {uptime ? dayjs.duration(uptime, 'second').humanize() : '-'}
              </Tooltip>
            )
          }}
        />
        <StatisticCard
          colSpan={cardColSpan}
          statistic={{
            title: 'CPU 使用率',
            value: cpuUsedRate || '-'
          }}
        />
        <StatisticCard
          colSpan={cardColSpan}
          statistic={{
            title: '内存占用',
            value: memoryUsed || '-'
          }}
        />
        <StatisticCard
          colSpan={cardColSpan}
          statistic={{
            title: '存储空闲',
            value: '未知'
          }}
        />
      </StatisticCard.Group>
    </ProCard>
  )
}

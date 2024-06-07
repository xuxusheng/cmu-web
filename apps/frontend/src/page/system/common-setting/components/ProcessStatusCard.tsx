import { ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import { ProCard, StatisticCard } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Empty, Modal, Space, Spin, Tag, Tooltip, message } from 'antd'
import dayjs from 'dayjs'
import { FC, useMemo } from 'react'
import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'

export const ProcessStatusCard: FC = () => {
  // ----------------------------- React-Query -----------------------------
  const restartProcessMutation = useMutation({
    mutationFn: systemApi.restartProcess
  })
  const processStatusQuery = useQuery({
    queryKey: [QueryKey.ProcessStatus],
    queryFn: () => systemApi.getProcessStatus(),
    refetchInterval: 1000 * 60 // 60s
  })

  const processStatus = useMemo(() => {
    return processStatusQuery.data?.data.data || []
  }, [processStatusQuery.data])

  // ----------------------------- Method -----------------------------
  const handleRestartProcess = (processName: string) => {
    Modal.confirm({
      title: `确定重启 ${processName} 进程吗？`,
      onOk: async () => {
        try {
          await restartProcessMutation.mutateAsync(processName)
        } catch (e) {
          // 请求失败也关闭弹窗
          return Promise.resolve(true)
        }

        message.success(`重启 ${processName} 进程成功`)
        processStatusQuery.refetch()
      }
    })
  }

  // ----------------------------- Render -----------------------------
  const renderContent = () => {
    if (processStatusQuery.isLoading) {
      return (
        <Spin>
          <div style={{ height: '100px' }} />
        </Spin>
      )
    }

    if (!processStatus.length) {
      return (
        <Empty>
          <div style={{ height: '24px' }} />
        </Empty>
      )
    }

    return (
      <StatisticCard.Group>
        {processStatus.map((item) => (
          <StatisticCard
            key={item.procName}
            statistic={{
              title: (
                <Space>
                  {item.procName}

                  <Tooltip title="重启进程">
                    <Button
                      icon={<ReloadOutlined />}
                      size="small"
                      type="text"
                      onClick={() => handleRestartProcess(item.procName)}
                    ></Button>
                  </Tooltip>
                </Space>
              ),
              valueRender: () =>
                item.isRunning ? (
                  <Tooltip
                    title={
                      // 天时分秒
                      dayjs
                        .duration(item.runTime, 'seconds')
                        .format('Y 年 M 个月 D 天 H 时 m 分 s 秒')
                    }
                  >
                    {dayjs.duration(item.runTime, 'seconds').humanize()}
                  </Tooltip>
                ) : (
                  <Tooltip title="点击重启">
                    <Tag bordered={false} color="red">
                      未启动
                    </Tag>
                  </Tooltip>

                  // <Tooltip title="重启进程">
                  //   <Button
                  //     size="large"
                  //     type="text"
                  //     onClick={() => handleRestartProcess(item.procName)}
                  //   >
                  //     <ReloadOutlined />
                  //   </Button>
                  // </Tooltip>
                ),
              status: item.isRunning ? 'success' : 'error'
            }}
          />
        ))}
      </StatisticCard.Group>
    )
  }

  return (
    <ProCard
      title={
        <Space>
          <SettingOutlined />
          系统进程
        </Space>
      }
    >
      {renderContent()}
    </ProCard>
  )
}

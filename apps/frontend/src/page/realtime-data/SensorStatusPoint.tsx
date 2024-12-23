import { Badge, Space, Tooltip } from 'antd'
import { FC, useCallback } from 'react'

import { SensorStatus } from '../../interface/sensor.ts'
import styles from './SensorStatusPoint.module.scss'

interface Props {
  sensorStatus?: SensorStatus
}

// 用三个点表示传感器状态
export const SensorStatusPoint: FC<Props> = (props) => {
  const { sensorStatus } = props

  // ------------------------------------ UseCallback ------------------------------------
  const getStatus = useCallback((n: number) => {
    if (n === 0) {
      return 'success'
    }
    if (n === 1) {
      return 'warning'
    }
    if (n === 2) {
      return 'error'
    }
    return 'default'
  }, [])

  const getStatusText = useCallback((n: number) => {
    if (n === 0) {
      return '正常'
    }
    if (n === 1) {
      return '预警'
    }
    if (n === 2) {
      return '告警'
    }
    return '未知'
  }, [])

  // ------------------------------------ Render ------------------------------------

  if (!sensorStatus) {
    return
  }

  return (
    <Space className={styles.main}>
      <Tooltip title={`通信状态${getStatusText(sensorStatus.movDevConf)}`}>
        <Badge
          className={styles.statusBadge}
          status={getStatus(sensorStatus.movDevConf)}
        />
      </Tooltip>
      <Tooltip title={`运行状态${getStatusText(sensorStatus.supDevRun)}`}>
        <Badge
          className={styles.statusBadge}
          status={getStatus(sensorStatus.supDevRun)}
        />
      </Tooltip>
      <Tooltip title={`数据状态${getStatusText(sensorStatus.dataStatus)}`}>
        <Badge
          className={styles.statusBadge}
          status={getStatus(sensorStatus.dataStatus)}
        />
      </Tooltip>
    </Space>
  )
}

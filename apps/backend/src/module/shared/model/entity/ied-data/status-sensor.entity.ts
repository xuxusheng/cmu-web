export interface StatusSensorEntity {
  status_id: number // 自增 ID

  sen_id: number

  data_time: Date

  mov_dev_conf: number

  sup_dev_run: number

  data_status: number

  alm_ignored: number
}

export interface UpdateStatusEntity {
  statusId: number // 自增 ID
  senId: number
  dataTime: Date
  movDevConf: number // 通信异常 0:正常 1:预警 2:告警 -1:未知
  supDevRun: number // 运行异常
  dataStatus: number // 数据异常
  almIgnored: number // 告警是否忽略
}

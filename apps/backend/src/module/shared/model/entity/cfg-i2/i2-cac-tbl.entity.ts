export interface I2CacTblEntity {
  cacId: string // 编号

  cacIp: string // IP 地址

  heartbeatPeriod: number // 心跳周期

  nextHeartbeatTime: string // 下次心跳时间
}

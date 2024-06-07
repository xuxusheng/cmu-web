export interface CacConfig {
  cacId: string // 编号

  cacIp: string // IP 地址

  heartbeatPeriod: number // 心跳周期

  nextHeartbeatTime: string // 下次心跳时间
}

export type UpdateCacDto = CacConfig

export interface CagConfig {
  cagId: number // 自增 ID

  cagIp: string // IP 地址

  cagPort: number // 端口号

  cagServiceLocate: string // 服务地址

  cagNamespace: string // 命名空间

  timeoutTime: number // 超时时间
}

export type CreateCagDto = Omit<CagConfig, 'cagId'>

export type UpdateCagDto = CagConfig

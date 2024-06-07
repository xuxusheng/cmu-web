export interface I2CagTblEntity {
  cagId: number // 自增 ID

  cagIp: string // IP 地址

  cagPort: number // 端口号

  cagServiceLocate: string // 服务地址

  cagNamespace: string // 命名空间

  timeoutTime: number // 超时时间
}

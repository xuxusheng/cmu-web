/**
 * 网卡信息
 */
export interface NetworkInterface {
  address: string
  netmask: string
  mac: string
  internal: boolean
  cidr: string | null
  family: 'IPv4' | 'IPv6'
  scopeid?: undefined
}

/**
 * 更新网卡信息
 */
export interface UpdateIpAddressDto {
  ifname: string // 网卡名称
  ip: string // ip 地址
  netmask: string // 子网掩码
  gateway: string // 网关
}

/**
 * 进程状态
 */
export interface ProcessStatus {
  procName: string // 进程名称
  pid: string // 进程号
  isRunning: boolean // 是否运行中
  runTime: number // 运行时间，单位秒
}

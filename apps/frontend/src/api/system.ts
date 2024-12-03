import { Dayjs } from 'dayjs'
import { LinkWithAddressInfo, RouteInfo } from 'iproute'

import { HostStatus } from '../interface/host-status.ts'
import { Res } from '../interface/res.ts'
import {
  NetworkInterface,
  ProcessStatus,
  UpdateIpAddressDto
} from '../interface/system.ts'
import { sleep } from '../utils/sleep.ts'
import { request } from './request.tsx'

class SystemApi {
  private readonly baseUrl = '/api'

  getHostStatus = () => {
    return request.get<Res<HostStatus>>(`/api/system/host-status`)
  }

  /**
   * 查询系统时间
   */
  getSystemTime = () => {
    return request.get<
      Res<{
        systemTime: string // ISO 时间字符串
      }>
    >(`${this.baseUrl}/system/time`)
  }

  /**
   * 设置系统时间
   */
  setSystemTime = (systemTime: Dayjs) => {
    return request.put(`${this.baseUrl}/system/time`, {
      systemTime: systemTime.toISOString()
    })
  }

  /**
   * 获取网卡信息
   */
  getNetworkInterfaces = () =>
    request.get<Res<Record<string, NetworkInterface[]>>>(
      `${this.baseUrl}/system/network-interfaces`
    )

  getIpAddress = () =>
    request.get<Res<LinkWithAddressInfo[]>>(`${this.baseUrl}/system/ip-address`)

  getIpAddressByName = (name: string) =>
    request.get<Res<LinkWithAddressInfo[]>>(
      `${this.baseUrl}/system/ip-address/${name}`
    )

  updateIpAddress = ({ ifname, ...rest }: UpdateIpAddressDto) =>
    request.put<Res>(`${this.baseUrl}/system/ip-address/${ifname}`, rest)

  getIpRoute = () =>
    request.get<Res<RouteInfo[]>>(`${this.baseUrl}/system/ip-route`)

  // 获取系统运行时间
  getUptime = () =>
    request.get<
      Res<{
        uptime: number // 单位：秒
      }>
    >(`/api/system/uptime`)

  // 获取 cpu 信息
  getCpu = () =>
    request.get<
      Res<
        {
          model: string
          speed: number
          times: {
            user: number
            nice: number
            sys: number
            idle: number
            irq: number
          }
        }[]
      >
    >(`/api/system/cpu`)

  // 获取内存信息
  getMemory = () =>
    request.get<
      Res<{
        total: number
        free: number
      }>
    >(`/api/system/memory`)

  getLicense = () =>
    request.get<Res<{ license: string }>>(`${this.baseUrl}/system/license`)

  getLicenseHash = () =>
    request.get<
      Res<{
        licenseHash: string
      }>
    >(`${this.baseUrl}/system/license-hash`)

  setLicense = (license: string) => {
    return request.post(`${this.baseUrl}/system/license`, {
      license
    })
  }

  // 获取进程状态
  getProcessStatus = async () => {
    // await sleep(500)

    // return {
    //   data: {
    //     data: [
    //       {
    //         procName: 'commu_whjy_ied',
    //         pid: '1593',
    //         isRunning: true,
    //         runTime: 12058.2
    //       },
    //       {
    //         procName: 'ntp_client',
    //         pid: '1536',
    //         isRunning: false,
    //         runTime: 12060.63
    //       },
    //       {
    //         procName: 'soap_proxy',
    //         pid: '1539',
    //         isRunning: true,
    //         runTime: 12058.306
    //       }
    //     ]
    //   }
    // }

    return request.get<Res<ProcessStatus[]>>(`${this.baseUrl}/system/process`)
  }

  // 重启进程
  restartProcess = async (processName: string) => {
    const res = await request.post<Res>(
      `${this.baseUrl}/system/process/restart`,
      {
        processName
      }
    )

    // 等待一下，给监控进程重启的时间
    await sleep(6000)

    return res
  }

  restartCommuWhjyIed = () => {
    return request.post(`
}${this.baseUrl}/proc_status/restart/commu_whjy_ied`)
  }

  restartNtpClient = () => {
    return request.post(`${this.baseUrl}/proc_status/restart/ntp_client`)
  }

  restartSoapProxy = () => {
    return request.post(`${this.baseUrl}/proc_status/restart/soap_proxy`)
  }

  getNetSet = () => {
    return request.get(`${this.baseUrl}/net_set`)
  }

  reboot = () => {
    return request.post(`${this.baseUrl}/system/reboot`)
  }
}

export const systemApi = new SystemApi()

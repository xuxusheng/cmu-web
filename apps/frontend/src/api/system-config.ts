import { Res } from '../interface/res.ts'
import {
  CollectConfig,
  LogConfig,
  MmsConfig,
  NtpConfig
} from '../interface/system-config.ts'
import { request } from './request.tsx'

export class SystemConfigApi {
  private readonly baseUrl = '/api/system-config'

  // 获取 MMS 配置
  getMmsConfig = () => request.get<Res<MmsConfig>>(`${this.baseUrl}/mms`)

  // 从 icd 文件中获取 IED 名称和 AP 名称
  getIedAndApName = (icdFileName: string) =>
    request.get<Res<{ iedName: string; apNameList: string[] }>>(
      `${this.baseUrl}/get-ied-and-ap-name`,
      {
        params: {
          icdFileName
        }
      }
    )

  // 更新 MMS 配置
  setMmsConfig = (data: MmsConfig) =>
    request.put<Res>(`${this.baseUrl}/mms`, data)

  // 获取日志配置
  getLogConfig = () => request.get<Res<LogConfig>>(`${this.baseUrl}/log`)

  // 更新日志配置
  setLogConfig = (data: LogConfig) =>
    request.put<Res>(`${this.baseUrl}/log`, data)

  // 获取 NTP 配置
  getNtpConfig = () => request.get<Res<NtpConfig>>(`${this.baseUrl}/ntp`)

  // 更新 NTP 配置
  setNtpConfig = (data: NtpConfig) =>
    request.put<Res>(`${this.baseUrl}/ntp`, data)

  // 获取采集参数
  getCollectConfig = () =>
    request.get<Res<CollectConfig>>(`${this.baseUrl}/collect`)

  // 更新采集参数
  updateCollectConfig = (data: CollectConfig) =>
    request.put(`${this.baseUrl}/collect`, data)
}

export const systemConfigApi = new SystemConfigApi()

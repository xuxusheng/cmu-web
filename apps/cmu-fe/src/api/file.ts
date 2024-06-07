import { CmuFile } from '../interface/file.ts'
import { Res } from '../interface/res.ts'
import { request } from './request.tsx'

class FileApi {
  private readonly baseUrl = '/api/file'

  // 上传 icd 文件
  uploadIcdFiles = (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    return request.post<Res>(`${this.baseUrl}/icd/upload`, formData)
  }

  // 上传配置文件（sqlite 文件）
  uploadConfigFiles = (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    return request.post<Res>(`${this.baseUrl}/config/upload`, formData)
  }

  // 应用配置文件
  applyConfigFile = (dto: { filename: string; type: string }) =>
    request.post(`${this.baseUrl}/config/apply`, dto)

  // 获取日志列表
  getLogList = () => request.get<Res<CmuFile[]>>(`${this.baseUrl}/log/list`)

  // 获取配置文件列表
  getConfigList = () =>
    request.get<Res<CmuFile[]>>(`${this.baseUrl}/config/list`)

  // 获取 icd 文件列表
  getIcdList = () => request.get<Res<CmuFile[]>>(`${this.baseUrl}/icd/list`)

  // 获取 icd 文件内容
  getIcdContent = (filename: string) =>
    request.get<Res<{ content: string }>>(
      `${this.baseUrl}/icd/content?filename=${filename}`
    )

  // 下载配置文件
  downloadConfig = (filename: string) => {
    window.open(`${this.baseUrl}/config/download?filename=${filename}`, '_self')
  }

  // 下载 icd 文件
  downloadIcd = (filename: string) => {
    window.open(`${this.baseUrl}/icd/download?filename=${filename}`, '_self')
  }

  // 下载日志
  downloadLog = (filename: string) => {
    window.open(`${this.baseUrl}/log/download?filename=${filename}`, '_self')
  }

  // 删除日志文件
  deleteLog = (filename: string) =>
    request.delete(`${this.baseUrl}/log/${filename}`)
}

export const fileApi = new FileApi()

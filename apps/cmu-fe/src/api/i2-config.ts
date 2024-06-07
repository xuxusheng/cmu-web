import {
  CacConfig,
  CagConfig,
  CreateCagDto,
  UpdateCacDto,
  UpdateCagDto
} from '../interface/i2-config.ts'
import { Res } from '../interface/res.ts'
import { request } from './request.tsx'

class I2ConfigApi {
  private readonly baseUrl = '/api/i2/config'

  getCac = () => request.get<Res<CacConfig>>(`${this.baseUrl}/cac`)

  updateCac = (data: UpdateCacDto) => request.put(`${this.baseUrl}/cac`, data)

  getCag = (cagId: number) =>
    request.get<Res<CagConfig>>(`${this.baseUrl}/cag/${cagId}`)

  getCagList = () => request.get<Res<CagConfig[]>>(`${this.baseUrl}/cag`)

  createCag = (data: CreateCagDto) => request.post(`${this.baseUrl}/cag`, data)

  updateCag = ({ cagId, ...rest }: UpdateCagDto) =>
    request.put(`${this.baseUrl}/cag/${cagId}`, rest)

  deleteCag = (cagId: number) => request.delete(`${this.baseUrl}/cag/${cagId}`)
}

export const i2ConfigApi = new I2ConfigApi()

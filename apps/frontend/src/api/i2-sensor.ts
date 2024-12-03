import dayjs from 'dayjs'

import {
  CreateI2SensorDto,
  I2Group,
  I2Phase,
  I2Sensor,
  I2SensorPageVO,
  UpdateI2SensorDto
} from '../interface/i2-sensor.ts'
import { DWithPage } from '../interface/page.ts'
import { Res } from '../interface/res.ts'
import { request } from './request.tsx'

class I2SensorApi {
  private readonly baseUrl = '/api/i2/sensor'

  create = ({ nextDataUploadTime, ...rest }: CreateI2SensorDto) =>
    request.post(this.baseUrl, {
      ...rest,
      nextDataUploadTime: dayjs(nextDataUploadTime).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    })

  update = ({ id, nextDataUploadTime, ...rest }: UpdateI2SensorDto) =>
    request.put(`${this.baseUrl}/${id}`, {
      ...rest,
      nextDataUploadTime: dayjs(nextDataUploadTime).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    })

  getById = (id: number) => request.get<Res<I2Sensor>>(`${this.baseUrl}/${id}`)

  list = () => request.get<Res<I2Sensor[]>>(`${this.baseUrl}/list`)

  // 查询 I2 传感器列表（分页）
  page = (params: { pn: number; ps: number }) =>
    request.get<Res<DWithPage<I2SensorPageVO>>>(`${this.baseUrl}/page`, {
      params
    })

  delete = (id: number) => request.delete(`${this.baseUrl}/${id}`)

  // 查询所有分组
  getAllGroup = () => request.get<Res<I2Group[]>>(`${this.baseUrl}/group`)

  // 查询所有相别
  getAllPhase = () => request.get<Res<I2Phase[]>>(`${this.baseUrl}/phase`)
}

export const i2SensorApi = new I2SensorApi()

import { Res } from '../interface/res.ts'
import { request } from './request.tsx'

class I2SensorDebugApi {
  private readonly baseUrl = '/api/i2/sensor/debug'

  getCommand = () =>
    request.get<
      Res<
        {
          label: string
          value: string
        }[]
      >
    >(`${this.baseUrl}/command`)

  // 下发命令
  sendCommand = (data: { i2SensorId: number; command: string }) =>
    request.post(`${this.baseUrl}/send-command`, {
      i2SensorId: data.i2SensorId,
      command: data.command
    })
}

export const i2SensorDebugApi = new I2SensorDebugApi()

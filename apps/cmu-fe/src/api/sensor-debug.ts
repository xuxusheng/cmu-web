import { Res } from '../interface/res.ts'
import { request } from './request.tsx'

class SensorDebugApi {
  private readonly baseUrl = '/api/sensor/debug'

  // 获取传感器对应的可用命令
  getCommand = (sensorId: number) =>
    request.get<
      Res<
        {
          label: string
          value: string
        }[]
      >
    >(`${this.baseUrl}/command?sensorId=${sensorId}`)

  // 下发命令
  sendCommand = (data: { sensorId: number; command: string; args?: string }) =>
    request.post<Res>(`${this.baseUrl}/send-command`, {
      sensorId: data.sensorId,
      command: data.command,
      args: data.args || ''
    })
}

export const sensorDebugApi = new SensorDebugApi()

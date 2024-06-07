import { SelectOption } from '../interface/common.ts'
import { DWithPage } from '../interface/page.ts'
import { Res } from '../interface/res.ts'
import {
  CreateSensorDto,
  PageSensorDto,
  SensorAttr,
  SensorBasicStatus,
  SensorRealtimeStatus,
  SensorReportData,
  SensorReportDataField,
  SensorStatus,
  SensorVO,
  UpdateSensorDto
} from '../interface/sensor.ts'
import { request } from './request.tsx'

class SensorApi {
  private readonly baseUrl = '/api/sensor'

  // --------------------------------- C ---------------------------------

  // 添加设备
  create = (data: CreateSensorDto) => request.post<Res>(`${this.baseUrl}`, data)

  // --------------------------------- U ---------------------------------

  // 更新传感器
  update = (data: UpdateSensorDto) => request.put<Res>(`${this.baseUrl}`, data)

  // --------------------------------- R ---------------------------------

  // 查询所有设备状态
  getAllSensorStatus = () =>
    request.get<Res<SensorStatus[]>>(`${this.baseUrl}/all-status`)

  // 获取设备最新上报数据
  getAllLatestReportData = () =>
    request.get<
      Res<
        Array<
          SensorVO & {
            latestReportTime: string // YYYY-MM-DD HH:mm:ss
            latestReportData: Array<
              SensorReportDataField & {
                value: string | number // 字段值
              }
            >
          }
        >
      >
    >(`${this.baseUrl}/all-latest-data`)

  getSenBasicStatus = () =>
    request<Res<{ list: SensorBasicStatus[] }>>(
      `/api/sensors/sen_basic_status`,
      {
        params: {
          top: 1
        }
      }
    )

  // 获取实时数据
  getSenRealtimeStatus = () => {
    return request<
      Res<{
        list: Array<
          Partial<Omit<SensorRealtimeStatus, 'senId'>> &
            Pick<SensorRealtimeStatus, 'senId'>
        >
      }>
    >(`/api/sensors/sen_update`, {
      params: {
        import_level: 2
      }
    })
  }

  // 查询设备类型可选项
  getLnClassOptions = async () =>
    request.get<Res<SelectOption[]>>(`${this.baseUrl}/ln-class-options`)

  // 查询设备型号可选项
  getSensorTypeOptions = (lnClass?: string) =>
    request.get<Res<SelectOption[]>>(`${this.baseUrl}/sensor-type-options`, {
      params: {
        lnClass
      }
    })

  // 查询通讯类型可选项
  getCommTypeOptions = () =>
    request.get<Res<SelectOption<number>[]>>(
      `${this.baseUrl}/comm-type-options`
    )

  // 查询所有设备类型和设备型号对应的属性字段
  getAllSensorAttrs = () =>
    request.get<
      Res<
        {
          lnClass: string // 设备类型
          sensorType: string // 设备型号
          attrs: SensorAttr[]
        }[]
      >
    >(`${this.baseUrl}/all-sensor-attrs`)

  // 查询指定设备类型和设备型号对应的属性字段
  getSensorAttrs = (params: { lnClass: string; sensorType: string }) =>
    request.get<Res<SensorAttr[]>>(`${this.baseUrl}/sensor-attrs`, {
      params
    })

  // 查询指定设备上报数据
  getReportData = (params: {
    id: number
    reportTimeRange?: [string, string] | null
    orderBy?: string
    orderSort?: string
  }) => {
    const { id, reportTimeRange, ...rest } = params

    const reportTimeBegin = reportTimeRange?.[0]
    const reportTimeEnd = reportTimeRange?.[1]

    console.log(reportTimeRange)

    return request.get<Res<SensorReportData[]>>(
      `${this.baseUrl}/${id}/report-data`,
      {
        params: {
          ...rest,
          // 拿到的就是 2022-01-22 的形式
          reportTimeBegin,
          reportTimeEnd
        }
      }
    )
  }

  // 查询指定设备 ID 对应的上报数据字段
  getReportDataFields = (sensorId: number) =>
    request.get<Res<SensorReportDataField[]>>(
      `${this.baseUrl}/${sensorId}/report-data-fields`
    )

  // 导出历史上报数据
  exportReportData = (id: number) =>
    window.open(`${this.baseUrl}/${id}/export-report-data`, '_self')

  // 查询单个传感器信息
  findById = (id: number) => request.get<Res<SensorVO>>(`${this.baseUrl}/${id}`)

  // 查询传感器列表
  list = (params?: {
    descCn?: string // 设备描述
    lnClass?: string // 设备类型
  }) =>
    request.get<Res<SensorVO[]>>(`${this.baseUrl}/list`, {
      params
    })

  // 查询传感器列表（分页）
  page = (params: PageSensorDto) =>
    request.get<Res<DWithPage<SensorVO>>>(`${this.baseUrl}/page`, {
      params
    })

  // --------------------------------- D ---------------------------------

  // 删除传感器
  delete = (id: number) => request.delete<Res>(`${this.baseUrl}/${id}`)
}

export const sensorApi = new SensorApi()

export interface MmsConfig {
  // ICD 文件目录
  icdFileDir: string
  // ICD 文件名
  icdFileName: string
  // IED 名称
  iedName: string
  // AP 名称
  apName: string
  // MMS 报告扫描频率
  mmsReportScanRate: number
  // MMS 报告缓存大小
  mmsReportCacheSize: number
  // MMS 日志扫描频率
  mmsLogScanRate: number
  // MMS 日志最大条目数
  mmsLogMaxEntry: number
  // MMS 日志 Tag 名
  mmsLogTagName: string
  // MMS 日志存储文件
  mmsLogFile: string
  // MMS 日志存储条目数
  mmsLogEntry: number
  // MMS 文件目录
  mmsFileDir: string
}

export interface LogConfig {
  // 启用日志文件
  logFileEnable: boolean
  // 日志文件大小
  logFileSize: number
  // 是否启用缓存
  logCacheEnable: boolean
  // 日志缓存大小
  logBufferSize: number
  // 日志目录
  logDir: string
  // 最大日志文件个数
  logFileMaxNum: number
  // 日志文件名
  logFileName: string
  // 分割日志
  logFileSplitEnable: boolean
}

export interface NtpConfig {
  ntpServerIp: string
  syncCycle: string
  isUseSharedMem: boolean
  outTime: string
}

export interface CollectConfig {
  autoRun: number // 自动采集[On,Off],(On)
  cpuTh: number // cpu 利用率告警阈值
  invalidData: number // 61850发送无效数据值(-9999)
  invalidQuality: number // 61850发送无效数据品质(64)
  memoryTh: number // 内存利用率告警阈值(%)(80)
  saveMode: number // 保存模式
  sendMsg: number // 进行61850上送[On,Off],(On)
  destStaticFile: string // 静态文件存放格式
  sourceStaticFile: string // 静态文件源文件
  soundAlmDo: number // 声光报警DO
}

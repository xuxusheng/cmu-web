/**
 * 进程状态
 */
export interface ProcessStatus {
  procName: string // 进程名称
  pid: string // 进程号
  isRunning: boolean // 是否运行中
  runTime: number // 运行时间，单位秒
}

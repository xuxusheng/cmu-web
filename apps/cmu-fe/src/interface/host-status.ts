export interface CpuStatus {
  cpuFree: number // cpu 空闲
  cpuNum: number // cpu 核心数
  freeTime: number
  runTime: number
}

export interface DiskStatus {
  avail: string
  fileSystem: string
  mountedOn: string
  size: string
  useRatio: string
  used: string
}

export interface MemStatus {
  freeMem: number
  freePercent: number
  totalMem: number
}

export interface HostStatus {
  cpuStatus: CpuStatus
  diskStatus: DiskStatus[]
  memoryStatus: MemStatus
}

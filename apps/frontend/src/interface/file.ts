export interface CmuFile {
  filename: string
  filePath: string
  size: number
  lastModified: string // ISO 8601 格式
  isSymbolicLink: boolean
  target?: string // 软链源文件地址
}

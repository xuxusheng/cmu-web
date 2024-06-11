export enum ConfigFileType {
  // 北向
  N = 'cfg_i2.sqlite3',
  // 南向
  S = 'cfg.sqlite3'
}

export const ConfigFileTypeLabelMap = {
  [ConfigFileType.N]: '北向应用配置文件',
  [ConfigFileType.S]: '南向接入配置文件'
}

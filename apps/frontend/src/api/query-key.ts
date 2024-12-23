export enum QueryKey {
  // User
  Me = 'Me',

  // Auth
  Captcha = 'Captcha', // 验证码

  // Sensors
  Sensor = 'Sensor', // 传感器
  Sensors = 'Sensors', // 传感器列表
  SensorPage = 'PageSensors', // 传感器列表（分页）
  SensorAttrs = 'SensorAttrs', // 传感器属性
  AllSensorsStatus = 'AllSensorStatus', // 所有传感器状态

  SensorBasicStatus = 'SensorBasicStatus', // 传感器基本状态

  // Sensor Options
  LnClassOptions = 'LnClassOptions', // 设备类型可选项
  SensorTypeOptions = 'SensorTypeOptions', // 设备型号可选项
  CommTypeOptions = 'CommTypeOptions', // 通讯类型可选项

  // Sensor Report Data
  AllSensorLatestData = 'AllSensorLatestData', // 所有传感器最新数据
  SensorReportData = 'SensorReportData', // 传感器上报数据
  SensorReportDataField = 'SensorReportDataField', // 传感器上报数据字段
  SensorReportDataFieldBySensorId = 'SensorReportDataFieldBySensorId', // 传感器上报数据字段（根据传感器 ID）

  // Sensor Debug
  SensorDebugCommands = 'SensorDebugCommands', // 传感器调试命令

  // System
  SystemVersion = 'SystemVersion', // 应用版本
  SystemTime = 'SystemTime', // 系统时间
  SystemUptime = 'SystemUptime', // 系统运行时间
  SystemCpu = 'SystemCpu', // CPU 信息
  SystemMemory = 'SystemMemory', // 内存信息
  NetworkInterfaces = 'NetworkInterfaces',
  License = 'License', // 授权信息
  LicenseHash = 'LicenseHash', // 授权信息
  ProcessStatus = 'ProcessStatus', // 进程状态

  // System Network
  SystemIpAddress = 'SystemIpAddress', // 网卡信息
  SystemIpAddressByName = 'SystemIpAddressByName', // 网卡信息（根据网卡名称）
  SystemIpRoute = 'SystemIpRoute', // 路由信息，用于获取网关信息

  // System Config
  MmsConfig = 'MmsConfig', // MMS 配置
  LogConfig = 'LogConfig', // 日志配置
  NtpConfig = 'NtpConfig', // NTP 配置
  CollectConfig = 'CollectConfig', // 采集配置
  IedAndApName = 'IedAndApName', // IED 名称和 AP 名称

  // File
  LogFileList = 'LogFileList', // 日志列表
  ConfigFileList = 'ConfigFileList', // 配置文件列表
  IcdFileList = 'IcdFileList', // ICD 文件列表
  IcdFileContent = 'IcdFileContent', // ICD 文件内容

  // I2 配置
  CacConfig = 'CacConfig', // I2 CAC 配置
  CagConfig = 'CagConfig', // I2 CAG 配置
  CagConfigList = 'CagConfigList', // I2 CAG 配置列表

  // I2 传感器
  I2Sensor = 'I2Sensor',
  I2Sensors = 'I2Sensors',
  I2SensorPage = 'I2SensorPage', // I2 传感器列表（分页）
  I2Groups = 'I2Groups', // I2 分组列表
  I2Phases = 'I2Phases', // I2 相别列表

  // I2 Sensor Debug
  I2SensorDebugCommands = 'I2SensorDebugCommands' // I2 传感器调试命令
}

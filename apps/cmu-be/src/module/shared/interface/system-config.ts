export interface MmsXmlConfig {
  '?xml': string
  MMS_CFG: {
    FileName: {
      LogCfgFile: string
      OsiCfgFile: string
      DatamapInputFile: string
      DatamapOutputFile: string
    }
    SclFile: {
      IcdFileDir: string
      IcdFileName: string
      IedName: string
      APName: string
    }
    MmsReport: {
      ReportScanRate: number
      BRCBBufferSize: number
    }
    MmsLog: {
      LogScanRate: number
      LogMaxEntries: number
      LogReasonTag: string
      SqliteFileName: string
      SqliteMaxRows: number
    }
    MmsMax: {
      MaxDynamicTypes: number
      MaxDynamicDoms: number
      MaxDynamicDomVars: number
      MaxDynamicDomNvls: number
    }
    MmsFile: {
      RootDir: string
    }
  }
}

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

// 开关
type OnOff = 'On' | 'Off'

export interface LogXmlConfig {
  '?xml': ''
  LOG_CFG: {
    LogControl: {
      LogElapsedTime: OnOff
      LogFileEnable: OnOff
      LogFileSize: number
      LogBufferSize: number
      LogDir: string
      LogCnt: number
      LogFileName: string
      DestroyOldFile: OnOff
      HardFlush: OnOff
      Setbuf: OnOff
      Wrap: OnOff
    }
    LogMasks: {
      LogConfigurationMasks: {
        LOGCFG_NERR: OnOff
        LOGCFG_FLOW: OnOff
      }
      UserLogMasks: {
        USER_LOG_CLIENT: OnOff
        USER_LOG_SERVER: OnOff
      }
      SecurityLogMasks: {
        SEC_LOG_NERR: OnOff
        SEC_LOG_FLOW: OnOff
        SEC_LOG_DATA: OnOff
        SEC_LOG_DEBUG: OnOff
        SSLE_LOG_NERR: OnOff
        SSLE_LOG_FLOW: OnOff
        SSLE_LOG_DATA: OnOff
        SSLE_LOG_DEBUG: OnOff
      }
      SemaphoreLogMasks: {
        GS_LOG_NERR: OnOff
        GS_LOG_FLOW: OnOff
      }
      Asn1LogMasks: {
        ASN1_LOG_NERR: OnOff
        ASN1_LOG_DEC: OnOff
        ASN1_LOG_ENC: OnOff
      }
      MmsLogMasks: {
        MMS_LOG_NERR: OnOff
        MMS_LOG_CLIENT: OnOff
        MMS_LOG_SERVER: OnOff
        MMS_LOG_DEC: OnOff
        MMS_LOG_ENC: OnOff
        MMS_LOG_RT: OnOff
        MMS_LOG_RTAA: OnOff
        MMS_LOG_AA: OnOff
      }
      MvlLogMasks: {
        MVLLOG_NERR: OnOff
        MVLLOG_ACSE: OnOff
        MVLLOG_ACSEDATA: OnOff
        MVLULOG_FLOW: OnOff
        MVLULOG_DEBUG: OnOff
      }
      AcseLogMasks: {
        ACSE_LOG_ENC: OnOff
        ACSE_LOG_DEC: OnOff
        COPP_LOG_DEC: OnOff
        COPP_LOG_DEC_HEX: OnOff
        COPP_LOG_ENC: OnOff
        COPP_LOG_ENC_HEX: OnOff
        COSP_LOG_DEC: OnOff
        COSP_LOG_DEC_HEX: OnOff
        COSP_LOG_ENC: OnOff
        COSP_LOG_ENC_HEX: OnOff
      }
      Tp4LogMasks: {
        TP4_LOG_FLOWUP: OnOff
        TP4_LOG_FLOWDOWN: OnOff
      }
      ClnpLogMasks: {
        CLNP_LOG_NERR: OnOff
        CLNP_LOG_REQ: OnOff
        CLNP_LOG_IND: OnOff
        CLSNS_LOG_REQ: OnOff
        CLSNS_LOG_IND: OnOff
      }
      SxLogMasks: {
        SX_LOG_NERR: OnOff
        SX_LOG_DEC: OnOff
        SX_LOG_ENC: OnOff
        SX_LOG_FLOW: OnOff
        SX_LOG_DEBUG: OnOff
      }
      SocketLogMasks: {
        SOCK_LOG_NERR: OnOff
        SOCK_LOG_FLOW: OnOff
        SOCK_LOG_TX: OnOff
        SOCK_LOG_RX: OnOff
      }
      SmpLogMasks: {
        SMP_LOG_REQ: OnOff
        SMP_LOG_IND: OnOff
      }
      MemLogMasks: {
        MEM_LOG_CALLOC: OnOff
        MEM_LOG_MALLOC: OnOff
        MEM_LOG_REALLOC: OnOff
        MEM_LOG_FREE: OnOff
      }
    }
  }
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

export interface NtpIniConfig {
  ntp: {
    ntp_server_ip: string
    sync_cycle: string
    is_use_sharedMem: string
    out_time: string
    rtc_dev: string
  }
}

export interface NtpConfig {
  ntpServerIp: string
  syncCycle: number
  isUseSharedMem: boolean
  outTime: number
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

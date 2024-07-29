import chalk from 'chalk'

const { blue, green, red, white, yellow } = chalk

// 日志级别
enum LogLevel {
  Debug = 'Debug',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  SubError = 'SubError',
  Success = 'Success'
}

// 不同日志级别对应的颜色
const COLOR_MAP = {
  [LogLevel.Debug]: blue,
  [LogLevel.Info]: white,
  [LogLevel.Warning]: yellow,
  [LogLevel.Error]: red,
  [LogLevel.SubError]: red.dim,
  [LogLevel.Success]: green
}

// todo 慢慢优化，支持上下文、按级别输出、错误堆栈信息等等
class Logger {
  #print(msg: string, level: LogLevel) {
    console.log(COLOR_MAP[level](msg))
  }

  // 调试信息，虽然说在 CLI 工具中好像用不到这个，还是习惯性写上来
  debug(msg: string) {
    this.#print(msg, LogLevel.Debug)
  }

  // 常规提示信息
  info(msg: string) {
    this.#print(msg, LogLevel.Info)
  }

  // 警告信息
  warning(msg: string) {
    this.#print(msg, LogLevel.Warning)
  }

  // 错误信息
  error(msg: string, subMsg: string[] = []) {
    this.#print(msg, LogLevel.Error)
    this.subError(subMsg)
  }

  // 具体的子错误信息
  subError(msgs: string[]) {
    msgs.forEach((msg) => {
      this.#print(msg, LogLevel.SubError)
    })
  }

  // 成功信息
  success(msg: string) {
    this.#print(msg, LogLevel.Success)
  }

  divider(msg = '', level: LogLevel = LogLevel.Info) {
    this.#print('----------------' + msg + '----------------', level)
  }
}

export const logger = new Logger()

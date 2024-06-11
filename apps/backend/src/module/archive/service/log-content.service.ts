import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { execSync } from 'child_process'
import { createReadStream } from 'fs'
import { chdir } from 'process'

import { createInterface } from 'readline'
import { gMmsConfig } from '../../core/config/g-mms.config'
import { getLogDirAndFileName } from '../../shared/utils/file'

@Injectable()
export class LogContentService {
  private readonly logger = new Logger(LogContentService.name)

  constructor(
    @Inject(gMmsConfig.KEY) private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {}

  getLogContent = async (type, start, limit: number) => {
    limit = limit < 0 ? 200 : limit
    let logFilename = ''
    if (type === 'ied') {
      const o = getLogDirAndFileName(this.gMmsConf.gMmsEtcHome)
      logFilename = `${o.logDir}/${o.logFile}`
      chdir(this.gMmsConf.gMmsHome)
    } else {
      logFilename = this.gMmsConf.gI2LogFilename
    }

    console.log('logfile: ', logFilename)
    if (start === 0) {
      const lineCount = execSync(`cat ${logFilename} |wc -l`)
      const count = parseInt(lineCount.toString().trim())
      start = count > limit ? count - limit : 0
    }

    this.logger.log(`on read logfile ${logFilename}, start: ${start}`)
    const filestream = createReadStream(logFilename)
    const rl = createInterface({
      input: filestream,
      crlfDelay: Infinity
    })
    let no = 0
    const lines = []
    for await (const line of rl) {
      if (++no > 200) break
      lines.push(line)
    }
    // } catch(e) {
    //     logger.warn(`read file ${logFilename} failed: `, e.message)
    //     throw e
    // }

    return { last_line: start + lines.length, log_content: lines }
  }
}

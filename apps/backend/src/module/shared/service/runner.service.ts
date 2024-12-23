import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import axios from 'axios'

import { serverConfig } from '../../core/config/server.config'
import { InternalServerErrorException } from '../../core/exception/custom-exception'

@Injectable()
export class RunnerService {
  constructor(
    @Inject(serverConfig.KEY)
    private serverConf: ConfigType<typeof serverConfig>
  ) {}

  // 执行命令
  runCmd = async (cmd: string): Promise<string> => {
    const url = this.serverConf.runnerUrl
    // 发送请求

    const res = await axios.post<{
      errCode: number
      errMsg: string
      data: {
        output: string
      }
    }>(`${url}/cmd/run`, { cmd })

    if (res.status !== 200 || res.data.errCode !== 0) {
      throw new InternalServerErrorException(
        res.data.errMsg || '执行命令失败'
      ).setErrDebug(JSON.stringify(res.data))
    }

    return res.data.data.output
  }
}

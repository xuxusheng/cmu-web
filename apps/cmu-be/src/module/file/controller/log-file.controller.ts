import { Controller, Delete, Get, Param, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { createReadStream } from 'fs'
import { BadRequestException } from '../../core/exception/custom-exception'
import { Public } from '../../shared/decorator/public'
import { sortByLastModified } from '../../shared/utils/sort'
import { LogFileService } from '../service/log-file.service'

@Controller('api/file/log')
export class LogFileController {
  constructor(private logFileService: LogFileService) {}

  // --------------------------- Read ---------------------------------

  //查询日志文件列表
  @Get('list')
  getLogs() {
    return this.logFileService.getLogFiles().sort(sortByLastModified)
  }

  // 下载日志文件
  @Public()
  @Get('download')
  downloadLog(@Query('filename') filename: string, @Res() res: Response) {
    if (!filename) {
      throw new BadRequestException('参数 filename 不能为空')
    }

    const path = this.logFileService.getFilePath(filename)

    res.set({
      'Content-Disposition': `attachment; filename=${encodeURIComponent(
        filename
      )}`
    })

    const file = createReadStream(path)
    file.pipe(res)
  }

  // --------------------------- Delete ---------------------------------
  @Delete(':filename')
  deleteLog(@Param('filename') filename: string) {
    return this.logFileService.delete(filename)
  }
}

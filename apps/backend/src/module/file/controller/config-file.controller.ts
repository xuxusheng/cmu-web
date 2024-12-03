import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { createReadStream } from 'fs'

import { BadRequestException } from '../../core/exception/custom-exception'
import { Public } from '../../shared/decorator/public'
import { sortByLastModified } from '../../shared/utils/sort'
import { ApplyConfigDto } from '../dto/apply-config.dto'
import { ConfigFileService } from '../service/config-file.service'

// 配置文件 Controller
// 这里的配置文件，其实就是系统中用的的 sqlite 数据库
@Controller('api/file/config')
export class ConfigFileController {
  constructor(private configFileService: ConfigFileService) {}

  // --------------------------- Create ---------------------------------

  // 上传配置文件
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadConfig(@UploadedFiles() files: Express.Multer.File[]) {
    return this.configFileService.upload(files)
  }

  // --------------------------- Update ---------------------------------

  // 应用配置文件
  @Post('apply')
  applyConfig(@Body() dto: ApplyConfigDto) {
    return this.configFileService.apply(dto)
  }

  // --------------------------- Read ---------------------------------
  // 查询配置文件列表
  @Get('list')
  getConfigFiles() {
    const files = this.configFileService.getConfigFiles()
    return files.sort(sortByLastModified)
  }

  // 下载配置文件
  @Public()
  @Get('download')
  downloadConfig(@Query('filename') filename: string, @Res() res: Response) {
    if (!filename) {
      throw new BadRequestException('参数 filename 不能为空')
    }

    const path = this.configFileService.getFilePath(filename)

    res.set({
      'Content-Disposition': `attachment; filename=${encodeURIComponent(
        filename
      )}`
    })

    const file = createReadStream(path)
    file.pipe(res)
  }
}

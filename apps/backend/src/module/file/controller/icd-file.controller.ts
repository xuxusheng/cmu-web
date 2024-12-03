import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { sleep } from '@nestjs/terminus/dist/utils'
import { Response } from 'express'
import { createReadStream } from 'fs'

import { BadRequestException } from '../../core/exception/custom-exception'
import { Public } from '../../shared/decorator/public'
import { sortByLastModified } from '../../shared/utils/sort'
import { IcdFileService } from '../service/icd-file.service'

@Controller('api/file/icd')
export class IcdFileController {
  constructor(private icdFileService: IcdFileService) {}

  // --------------------------- Create ---------------------------------

  // 上传 ICD 文件
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadIcd(@UploadedFiles() files: Express.Multer.File[]) {
    this.icdFileService.uploadIcdFiles(files)
  }

  // --------------------------- Read ---------------------------------

  // 查询 ICD 文件列表
  @Get('list')
  getIcdFiles() {
    const files = this.icdFileService.getIcdFiles()
    return files.sort(sortByLastModified)
  }

  // 查询 ICD 文件内容
  @Get('content')
  async getFileContent(@Query('filename') filename: string) {
    if (!filename) {
      throw new BadRequestException('参数 filename 不能为空')
    }
    await sleep(3000)
    return {
      content: this.icdFileService.getFileContent(filename)
    }
  }

  // 下载 ICD 文件
  @Public()
  @Get('download')
  downloadIcd(@Res() res: Response, @Query('filename') filename: string) {
    if (!filename) {
      throw new BadRequestException('参数 filename 不能为空')
    }

    const path = this.icdFileService.getFilePath(filename)

    res.set({
      'Content-Disposition': `attachment; filename=${encodeURIComponent(
        filename
      )}`
    })

    const file = createReadStream(path)
    file.pipe(res)
  }
}

import { Controller, Get, Query } from '@nestjs/common'
import { LogContentService } from '../service/log-content.service'

@Controller('api/log_content')
export class LogContentController {
  constructor(private logContentSvc: LogContentService) {}

  @Get()
  async findAll(@Query() query) {
    if (!query.hasOwnProperty('type')) {
      throw new Error('Need file type!')
    }

    const type = query.type
    if (type != 'i2' && type != 'ied') {
      throw new Error(`bad type value ${type}`)
    }

    const limit = parseInt(query?.limit) || 200
    const start = parseInt(query?.start) || 0

    return this.logContentSvc.getLogContent(type, start, limit)
  }
}

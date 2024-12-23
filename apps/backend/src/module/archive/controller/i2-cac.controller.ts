import { Controller, Get, Post } from '@nestjs/common'

import { I2CacService } from '../service/i2-cac.service'

@Controller('api/cac_infos')
export class I2CacController {
  constructor(private i2CacSvc: I2CacService) {}

  @Get()
  getAllInfos() {
    return this.i2CacSvc.getAllInfos()
  }

  @Post()
  deleteAll() {
    return this.i2CacSvc.deleteAll()
  }
}

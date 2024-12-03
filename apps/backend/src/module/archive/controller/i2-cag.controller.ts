import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { I2CagService } from '../service/i2-cag.service'

@Controller('api/cag_infos')
export class I2CagController {
  constructor(private i2CagSvc: I2CagService) {}

  @Get()
  getAllInfos() {
    return this.i2CagSvc.getAllInfos()
  }

  @Post()
  addInfo(@Body() body) {
    return this.i2CagSvc.addInfo(body)
  }

  @Post(':cagId')
  updateInfoById(@Param() { cagId }, @Body() body) {
    return this.i2CagSvc.updateInfoById(cagId, body)
  }

  // fixme: params 能传数组？？？
  @Delete(':cagIds')
  deleteInfoById(@Param() { cagIds }) {
    return this.i2CagSvc.deleteInfoById(cagIds.split(','))
  }
}

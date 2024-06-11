import { Controller, Get } from '@nestjs/common'
import { I2GroupService } from '../service/i2-group.service'

@Controller('api/i2_groups')
export class I2GroupController {
  constructor(private i2GroupSvc: I2GroupService) {}

  @Get()
  getAllInfos() {
    return this.i2GroupSvc.getAllInfos()
  }
}

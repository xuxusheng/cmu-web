import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common'
import { I2CagService } from '../service/i2-cag.service'
import { I2ParamgroupService } from '../service/i2-paramgroup.service'

@Controller('api/i2_params')
export class I2ParamController {
  constructor(
    private i2ParamgroupSvc: I2ParamgroupService,
    private i2CagSvc: I2CagService
  ) {}

  @Get()
  getAllInfos(@Query() query) {
    const groupId = query.group_id

    // fixme: 逻辑没有反？？？？？
    if (groupId) {
      return this.i2ParamgroupSvc.getAllInfos()
    } else {
      return this.i2ParamgroupSvc.getParamsByGroupId(groupId)
    }
  }

  @Post()
  addInfo(@Body() body) {
    // fixme: 调 i2CagSvc ？？？？
    return this.i2CagSvc.addInfo(body)
  }

  @Post(':paramId')
  updateInfoById(@Param() { paramId }, @Body() body) {
    return this.i2CagSvc.updateInfoById(paramId, body)
  }

  @Delete(':paramId')
  deleteInfoById(@Param() { paramId }) {
    // fixme: whereIn 给单个值能生效？？？？
    return this.i2CagSvc.deleteInfoById(paramId)
  }
}

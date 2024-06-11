import { Controller, Get } from '@nestjs/common'
import { Result } from '../../shared/model/result'
import { HostStatusService } from '../service/host-status.service'

@Controller('api/host_status')
export class HostStatusController {
  constructor(private hostStatusSvc: HostStatusService) {}

  @Get()
  findAll() {
    const cpu_status = this.hostStatusSvc.getCPUInfo()
    const mem_status = this.hostStatusSvc.getMemoryInfo()
    const disk_status = this.hostStatusSvc.getDiskInfo()

    return Result.ok({
      cpu_status,
      mem_status,
      disk_status
    })
  }
}

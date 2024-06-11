import { Module } from '@nestjs/common'
import { KnexService } from './service/knex.service'
import { RunnerService } from './service/runner.service'

@Module({
  imports: [],
  providers: [KnexService, RunnerService],
  exports: [KnexService, RunnerService]
})
export class SharedModule {}

import { Controller, Get } from '@nestjs/common'

@Controller('api/users')
export class UserController {
  constructor() {}

  @Get()
  async findAll() {
    return 'respond with a resource'
  }
}

import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import { BadRequestException } from '../core/exception/custom-exception'
import { ExistsByUsernameDto } from './dto/exists-by-username.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateUsernameDto } from './dto/update-username.dto'
import { UserCreateDto } from './dto/user-create.dto'
import { UserService } from './user.service'

@Controller('api/user')
export class UserController {
  constructor(private userSvc: UserService) {}

  // ------------------------------------------------- Create --------------------------------------------------

  // 创建新用户
  @Post('create')
  create(@Body() dto: UserCreateDto) {
    return this.userSvc.create(dto)
  }

  // ------------------------------------------------- Read --------------------------------------------------

  // 获取当前登录用户信息
  @Get('me')
  async getMe(@Req() req: Request) {
    const id = req.user.userId
    const user = await this.userSvc.findById(id)
    return {
      id: user.userId,
      username: user.userName,
      isAdmin: user.userLevel === 1
    }
  }

  // 查询用户名是否存在
  @Get('exists-by-username')
  async existsByUsername(@Query() dto: ExistsByUsernameDto) {
    const isExist = await this.userSvc.existsByUsername(
      dto.username,
      dto.excludeId
    )

    return {
      isExist
    }
  }

  // 修改当前登录用户用户名
  @Put('me/update-username')
  async updateMeUsername(@Req() req: Request, @Body() dto: UpdateUsernameDto) {
    const id = req.user.userId
    await this.userSvc.updateUsername(id, dto.username)
  }

  // 修改当前登录用户密码
  @Put('me/update-password')
  async updateMePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    const id = req.user.userId

    // 验证旧密码是否正确
    const isValid = await this.userSvc.validatePassword(id, dto.oldPassword)

    if (!isValid) {
      throw new BadRequestException('旧密码不正确')
    }

    await this.userSvc.updatePassword(id, dto.newPassword)
  }
}

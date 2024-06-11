import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { Md5 } from 'ts-md5'
import { BadRequestException } from '../core/exception/custom-exception'
import { UserInfoTblEntity } from '../shared/model/entity/cfg/user-info-tbl.entity'
import { KnexService } from '../shared/service/knex.service'
import { UserCreateDto } from './dto/user-create.dto'

@Injectable()
export class UserService {
  private readonly cfgDB: Knex

  constructor(private knexSvc: KnexService) {
    this.cfgDB = knexSvc.getCfgDB()
  }

  // ---------------------------------------- Create ----------------------------------------

  create = async (dto: UserCreateDto) => {
    const { username, password, level } = dto

    // 判断用户名是否重复
    if (await this.existsByUsername(username)) {
      throw new BadRequestException(`用户名 ${username} 已存在`)
    }

    const hash = Md5.hashAsciiStr(password)
    return this.cfgDB<UserInfoTblEntity>('user_info_tbl').insert({
      userName: username,
      password: hash,
      userLevel: level
    })
  }

  // ---------------------------------------- Read ----------------------------------------

  findById = (id: number) => {
    return this.cfgDB<UserInfoTblEntity>('user_info_tbl')
      .where('userId', id)
      .first()
  }

  findByUsername = (username: string) => {
    return this.cfgDB<UserInfoTblEntity>('user_info_tbl')
      .where('userName', username)
      .first()
  }

  // 判断用户名是否存在
  existsByUsername = async (username: string, excludeId?: number) => {
    const user = await this.cfgDB<UserInfoTblEntity>('user_info_tbl')
      .where((builder) => {
        builder.where('userName', username)
        if (excludeId) {
          builder.whereNot('userId', excludeId)
        }
      })
      .select('userId')
      .first()
    return !!user
  }

  // 验证密码是否正确
  validatePassword = async (id: number, password: string) => {
    const user = await this.findById(id)
    const hash = Md5.hashAsciiStr(password)
    return user.password === hash
  }

  // 修改用户名
  updateUsername = async (id: number, username: string) => {
    if (await this.existsByUsername(username, id)) {
      throw new BadRequestException('用户名已存在')
    }

    // 修改用户名
    await this.cfgDB<UserInfoTblEntity>('user_info_tbl')
      .where('userId', id)
      .update({ userName: username })
  }

  updatePassword = async (id: number, password: string) => {
    const hash = Md5.hashAsciiStr(password)
    await this.cfgDB<UserInfoTblEntity>('user_info_tbl')
      .where('userId', id)
      .update({ password: hash })
  }
}

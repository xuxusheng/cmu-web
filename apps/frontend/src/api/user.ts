import { request } from './request.tsx'
import { ResFromController } from '../interface/helper.ts'
import { UserController } from 'backend/dist/module/user/user.controller.ts'
import { UpdateUsernameDto } from 'backend/dist/module/user/dto/update-username.dto'

export class UserApi {
  private readonly baseUrl = '/api/user'

  me = () => request<ResFromController<UserController['getMe']>>(`${this.baseUrl}/me`)

  // 修改当前登录用户密码
  updateMePassword = (data: { oldPassword: string; newPassword: string }) =>
    request.put(`${this.baseUrl}/me/update-password`, data)

  // 修改当前登录用户用户名
  updateMeUserInfo = (data: UpdateUsernameDto) =>
    request.put<ResFromController<UserController['updateMeUsername']>>(`${this.baseUrl}/me/update-username`, data)
}

export const userApi = new UserApi()

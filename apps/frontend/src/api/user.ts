import { Res } from '../interface/res.ts'
import { User } from '../interface/user.ts'
import { request } from './request.tsx'

export class UserApi {
  private readonly baseUrl = '/api/user'

  me = () => request<Res<User>>(`${this.baseUrl}/me`)

  // 修改当前登录用户密码
  updateMePassword = (data: { oldPassword: string; newPassword: string }) =>
    request.put(`${this.baseUrl}/me/update-password`, data)

  // 修改当前登录用户用户名
  updateMeUserInfo = (data: { username: string }) =>
    request.put(`${this.baseUrl}/me/update-username`, data)
}

export const userApi = new UserApi()

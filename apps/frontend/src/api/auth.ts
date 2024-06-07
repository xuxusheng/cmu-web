import { Res } from '../interface/res.ts'
import { request } from './request.tsx'

class AuthApi {
  // 获取验证码
  getCaptcha = () =>
    request.get<Res<{ id: string; svg: string }>>('/api/auth/captcha')

  loginByPassword = (data: {
    username: string
    password: string
    captchaId: string
    captchaText: string
  }) =>
    request.post<Res<{ token: string }>>('/api/auth/login-by-password', data)
}

export const authApi = new AuthApi()

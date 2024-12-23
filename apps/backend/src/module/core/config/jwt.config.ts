import { registerAs } from '@nestjs/config'

export const jwtConfig = registerAs('jwt', () => ({
  // 环境变量名称不规范，应该是 secret key 的意思
  secret: process.env.IED_WEB_TOKEN || 'cmu.secret'
}))

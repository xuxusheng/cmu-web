import { registerAs } from '@nestjs/config'

export const serverConfig = registerAs('server', () => {
  return {
    // cmu-runner 访问地址
    runnerUrl: process.env.RUNNER_URL || 'http://localhost:3001'
  }
})

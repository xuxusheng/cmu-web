import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

// 将某个接口标记为 public，
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

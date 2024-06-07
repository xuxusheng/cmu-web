import { message, notification } from 'antd'
import axios, { HttpStatusCode } from 'axios'
import { Res } from '../interface/res.ts'
import { getToken, removeToken } from '../utils/token.ts'

enum ErrCode {
  Success = 0,

  // Token 相关错误
  TokenEmpty = 401_00_001,
  TokenExpired = 401_00_002,
  TokenInvalid = 401_00_003
}

const instance = axios.create({
  validateStatus: () => true,
  baseURL: '/'
})

instance.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

instance.interceptors.response.use((res) => {
  const data = (res.data as Res) || {}

  if (
    [ErrCode.TokenEmpty, ErrCode.TokenExpired, ErrCode.TokenInvalid].includes(
      data.errCode
    )
  ) {
    removeToken()
    // 跳转登录页面
    window.location.href = '/login'
    throw new Error('未登录或登录过期')
  }

  if (!Object.prototype.hasOwnProperty.call(data, 'errCode')) {
    let msg = res.statusText

    if (res.status === HttpStatusCode.Ok) {
      msg = '接口返回数据格式有误，请联系管理员'
    }

    console.error(msg, data)
    message.error(msg)
    throw new Error(msg)
  }

  if (data.errCode !== ErrCode.Success) {
    if (data.errDetails && data.errDetails.length > 0) {
      // errDetails 字段存在时，一般是表单提交的字段校验未通过，使用 notification 提示
      notification.error({
        message: data.errMsg,
        description: data.errDetails.map((v) => <p key={v}>{v}</p>)
      })
    } else {
      message.error(data.errMsg || '未知错误，请联系管理员')
    }

    throw data
  }

  return res
})

export const request = instance

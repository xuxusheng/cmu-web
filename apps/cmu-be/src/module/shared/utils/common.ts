import { isNil } from 'lodash'

/**
 * 判断当前值是否为 null 或 undefined 或空字符串
 */
export const isNilOrEmptyStr = (val: unknown) => {
  return isNil(val) || val === ''
}

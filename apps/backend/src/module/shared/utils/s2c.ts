import { camelCase } from 'change-case'
import { isNil } from 'lodash'

export const s2c = (data: unknown) => {
  if (isNil(data)) {
    return data
  }

  if (typeof data === 'string') {
    return camelCase(data)
  }

  if (Array.isArray(data)) {
    return data.map(s2c)
  }

  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        s2c(key),
        typeof value === 'object' ? s2c(value) : value
      ])
    )
  }

  return data
}

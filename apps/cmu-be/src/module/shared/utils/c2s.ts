import { snakeCase } from 'change-case'
import { isNil } from 'lodash'

export const c2s = (data: unknown) => {
  if (isNil(data)) {
    return data
  }

  if (typeof data === 'string') {
    return snakeCase(data)
  }

  if (Array.isArray(data)) {
    return data.map(c2s)
  }

  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        c2s(key),
        typeof value === 'object' ? c2s(value) : value
      ])
    )
  }

  return data
}

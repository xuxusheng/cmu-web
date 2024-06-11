const isNumericString = (value: string) => {
  const reg = /^\d+$/
  return reg.test(value)
}

// 将指定的列转换为整数
export const str2Int = <
  T,
  K extends keyof T,
  R = { [P in keyof T]: P extends K ? number : T[P] }
>(
  keys: K[],
  list: T[]
): R[] => {
  return list.map((item) => {
    const newItem = {} as R

    Object.entries(item).forEach(([key, value]) => {
      if (keys.includes(key as K) && isNumericString(value)) {
        newItem[key] = parseInt(value)
        return
      }

      // 如果不是指定的 Key，或不是纯数字组成，则不转换
      newItem[key] = value
    })

    return newItem
  })
}

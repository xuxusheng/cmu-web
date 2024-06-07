import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { useInterval } from 'react-use'

export const useTimeTicker = (initialTime?: Dayjs) => {
  const [time, setTime] = useState<Dayjs | undefined>(initialTime)

  useInterval(() => {
    setTime(time?.add(1, 'second'))
  }, 1000)

  return { time, setTime }
}

import { FC, PropsWithChildren, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMount } from 'react-use'

import { getToken } from '../utils/token.ts'

export const LoginGuard: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()

  const [isReady, setIsReady] = useState(false)

  useMount(() => {
    const token = getToken()

    if (!token) {
      navigate('/login')
      return
    }

    setIsReady(true)
  })

  if (!isReady) {
    return <></>
  }

  return children
}

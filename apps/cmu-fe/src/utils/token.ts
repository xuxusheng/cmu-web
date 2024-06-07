const TOKEN_KEY = 'cmu-token'
import * as lscache from 'lscache'

export const getToken = () => {
  return lscache.get(TOKEN_KEY)
}

export const setToken = (token: string) => {
  lscache.set(TOKEN_KEY, token)
}

export const removeToken = () => {
  lscache.remove(TOKEN_KEY)
}

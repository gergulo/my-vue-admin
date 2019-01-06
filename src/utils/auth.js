import storage from '@/utils/storage'

const token_key = 'x-token'

export function getToken() {
  return storage.getStorage(token_key)
}

export function setToken(token, expire) {
  return storage.setStorage(token_key, token, expire)
}

export function removeToken() {
  return storage.removeStorage(token_key)
}


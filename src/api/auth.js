/**
 * 登录相关接口
 */
import request from '@/utils/request'
import qs from 'qs'

export default {

  loginByUserName(user_name, password) {
    const params = {
      u: user_name,
      p: password
    }
    return request({
      url: '/index/login',
      method: 'get',
      params: params
    })
  },

  logout() {
    return request({
      url: '/index/logout',
      method: 'get'
    })
  },

  getUserInfo() {
    return request({
      url: '/index/info',
      method: 'get'
    })
  },

  updatePwd(params) {
    return request({
      url: '/index/pwd',
      method: 'patch',
      data: qs.stringify(params)
    })
  },
}
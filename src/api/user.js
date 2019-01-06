/**
 * “用户管理”相关接口
 */
import request from '@/utils/request'
import qs from 'qs'

export default {

  queryUser(queryParam, pageParam) {
    const params = qs.stringify({
      ...queryParam,
      current: pageParam.current,
      size: pageParam.size
    })
    return request({
      url: '/user/query',
      method: 'post',
      data: params
    })
  },

  addUser(params) {
    return request({
      url: '/user/add',
      method: 'post',
      data: qs.stringify(params)
    })
  },

  updateUser(params) {
    return request({
      url: '/user/update',
      method: 'patch',
      data: qs.stringify(params)
    })
  },

  deleteUser(params) {
    return request({
      url: '/user/delete',
      method: 'delete',
      params: params
    })
  },

  updatePwd(params) {
    return request({
      url: '/user/pwd',
      method: 'patch',
      data: qs.stringify(params)
    })
  },

  /**
   * 更新用户的角色
   * @param params
   */
  updateUserRoles(params) {
    return request({
      url: '/user/role',
      method: 'patch',
      data: qs.stringify(params)
    })
  }

}


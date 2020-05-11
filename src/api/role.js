/**
 * “角色管理”相关接口
 */
import request from '@/utils/request'
import qs from 'qs'

export default {

  /**
   * 查询角色
   * @param queryParam
   * @param pageParam
   */
  queryRole(queryParam, pageParam) {
    const params = qs.stringify({
      ...queryParam,
      current: pageParam.current,
      size: pageParam.size
    })
    return request({
      url: '/role/query',
      method: 'post',
      data: params
    })
  },

  /**
   * 添加角色
   * @param params
   */
  addRole(params) {
    return request({
      url: '/role/add',
      method: 'post',
      data: qs.stringify(params)
    })
  },
  
  /**
   * 修改角色
   * @param params
   */
  updateRole(params) {
    return request({
      url: '/role/update',
      method: 'patch',
      data: qs.stringify(params)
    })
  },

  /**
   * 删除角色
   * @param params
   */
  deleteRole(params) {
    return request({
      url: '/role/delete',
      method: 'delete',
      params: params
    })
  },

  /**
   * 查选角色的所有权限值
   * @param id
   */
  getRolePerms(id) {
    return request({
      url: '/role/getRolePerms',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 修改角色的权限
   * @param perm
   */
  updateRolePerms(params) {
    return request({
      url: '/role/updatePerms',
      method: 'patch',
      data: qs.stringify(params)
    })
  },

  /**
   * 添加角色的权限
   * @param perm
   */
  addRolePerm(params) {
    return request({
      url: '/role/addPerm',
      method: 'post',
      data: qs.stringify(params)
    })
  },

  /**
   * 删除角色的权限
   * @param params
   */
  deleteRolePerm(params) {
    return request({
      url: '/role/deletePerm',
      method: 'delete',
      params: params
    })
  },

  /**
   * 获取所有角色
   */
  listAllRole() {
    return request({
      url: '/role/listall',
      method: 'get'
    })
  }
}


/**
 * “权限管理”相关接口
 */
import request from '@/utils/request'
import qs from 'qs'

export default{

  /**
   * 同步菜单权限数据
   * @param params
   */
  syncMenuPerms(params) {
    return request({
      url: '/perm/syncMenuPerms',
      method: 'post',
      data: qs.stringify(params)
    })
  },

  /**
   * 添加权限
   * @param params
   */
  addPerm(params) {
    return request({
      url: '/perm/add',
      method: 'post',
      data: qs.stringify(params)
    })
  },

  /**
   * 更新权限
   * @param params
   */
  updatePerm(params) {
    return request({
      url: '/perm/update',
      method: 'patch',
      data: qs.stringify(params)
    })
  },

  /**
   * 删除权限
   * @param params
   */
  deletePerm(params) {
    return request({
      url: '/perm/delete',
      method: 'delete',
      data: qs.stringify(params)
    })
  },

  /**
   * 查询接口权限数据
   */
  listApiPermLGroup() {
    return request({
      url: '/perm/getApiPerms',
      method: 'get'
    })
  },

  /**
   * 列出所有菜单、按钮、接口等权限
   * @param perm
   */
  listAllPerms() {
    return request({
      url: '/perm/listAll',
      method: 'get'
    })
  },

  /**
   * 列出按钮权限，按parent字段分组
   * @param perm
   */
  listBtnPermGroupByParent() {
    return request({
      url: '/perm/getBtnPerms',
      method: 'get'
    })
  }
}

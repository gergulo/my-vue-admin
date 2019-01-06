const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  user_name: state => state.user.name,
  nick_name: state => state.user.nick_name,
  remark: state => state.user.remark,
  status: state => state.user.status,
  roles: state => state.user.roles,
  perms: state => state.user.perms,
  visitor: state => state.user.visitor,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
}
export default getters

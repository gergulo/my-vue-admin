import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard', noCache: true }
      },
    ]
  },
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    meta: { perm: 'm:sys', title: '系统', icon: 'manage' },
    children: [
      {
        path: 'user_manage',
        name: 'user_manage',
        component: () => import('@/views/_system/user/index'),
        meta: { perm: 'm:sys:user', title: '用户管理', icon: 'group', noCache: true }
      },
      {
        path: 'role_manage',
        name: 'role_manage',
        component: () => import('@/views/_system/role/index'),
        meta: { perm: 'm:sys:role', title: '角色管理', icon: 'group2', noCache: true },
      },
      {
        path: 'role_manage/:role_id/assign_perm',
        name: 'role_manage_assign_perm',
        component: () => import('@/views/_system/role/assign_perm'),
        meta: { hiddenTag: true, title: '角色授权' },
        hidden: true
      },
      {
        path: 'perm_manage',
        name: 'perm_manage',
        component: () => import('@/views/_system/perm/index'),
        meta: { perm: 'm:sys:perm', title: '权限管理', icon: 'key', noCache: true }

      },
    ]
  },
  {
    path: '/icons',
    component: Layout,
    meta: { perm: 'm:icon', title: '图标', icon: 'icon' },
    children: [
      {
        path: 'svg_icon',
        name: 'svg_icon',
        component: () => import('@/views/icons/svgicon/index'),
        meta: { perm:'m:icon:svgicon', title: 'svg格式-图标', icon: 'icon', noCache: true }
      },
      {
        path: 'ele_icon',
        name: 'ele_icon',
        component: () => import('@/views/icons/ele_icon'),
        meta: { perm:'m:icon:eleicon', title: 'element-ui图标', icon: 'icon', noCache: true }
      },
      {
        path: 'iconfont_icon',
        name: 'iconfont_icon',
        component: () => import('@/views/icons/iconfont_icon'),
        meta: { perm:'m:icon:iconfonticon', title: 'iconfont图标', icon: 'icon', noCache: true }
      },
    ]
  },
  {
    path: '/components',
    component: Layout,
    meta: { perm: 'm:component', title: '组件', icon: 'component' },
    children: [
      {
        path: 'editor',
        name: 'editor',
        component: () => import('@/views/components/editor'),
        meta: { perm:'m:component:editor', title: '富文本编辑器', icon: 'edit', noCache: true }
      },
      {
        path: 'markdown',
        name: 'markdown',
        component: () => import('@/views/components/markdown'),
        meta: { perm:'m:component:markdown', title: 'Markdown', icon: 'edit', noCache: true }
      },
    ]
  },
  {
    path: '/charts',
    name: 'charts',
    component: Layout,
    redirect: 'noredirect',
    meta: { title: '图表', icon: 'chart' },
    children: [
      { 
        path: 'keyboardchart', 
        name: 'keyboardchart', 
        component: () => import('@/views/charts/keyboardChart'), 
        meta: { title: '键盘图', noCache: true }
      },
      { 
        path: 'linechart', 
        name: 'linechart', 
        component: () => import('@/views/charts/lineChart'), 
        meta: { title: '折线图', noCache: true }
      },
      { 
        path: 'mixchart', 
        name: 'mixchart', 
        component: () => import('@/views/charts/mixChart'), 
        meta: { title: '折线与柱状混合图', noCache: true }
      },
      { 
        path: 'mapchart', 
        name: 'mapchart', 
        component: () => import('@/views/charts/mapChart'), 
        meta: { title: '迁移图', noCache: true }
      },
      { 
        path: 'piechart', 
        name: 'piechart', 
        component: () => import('@/views/charts/pieChart'), 
        meta: { title: '饼图', noCache: true }
      },
      { 
        path: 'timelinechart', 
        name: 'timelinechart', 
        component: () => import('@/views/charts/timelineChart'), 
        meta: { title: '时间线图', noCache: true }
      },
      { 
        path: 'buslinechart', 
        name: 'buslinechart', 
        component: () => import('@/views/charts/buslineChart'), 
        meta: { title: '公交线路图', noCache: true }
      },
      { 
        path: 'heatmapchart', 
        name: 'heatmapchart', 
        component: () => import('@/views/charts/heatmapChart'), 
        meta: { title: '热力图', noCache: true }
      },
      { 
        path: 'achart', 
        name: 'achart', 
        component: () => import('@/views/charts/achart'), 
        meta: { title: '图表集合1', noCache: true }
      }
    ]
  },
  {
    path: '/nested',
    name: 'nested',
    component: Layout,
    redirect: '/nested/menu1/menu1-1',
    meta: { perm:'m:nested', title: '路由嵌套', icon: 'nested' },
    children: [
      {
        path: 'menu1',
        name: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        meta: { perm:'m:nested:menu1', title: '菜单1' },
        redirect: '/nested/menu1/menu1-1',
        children: [
          {
            perm:'m:nested:mixchart', 
            path: 'menu1-1',
            name: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            meta: { perm:'m:nested:menu1:1', title: '菜单1-1' }
          },
          {
            perm:'m:component:mixchart', 
            path: 'menu1-2',
            name: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            redirect: '/nested/menu1/menu1-2/menu1-2-1',
            meta: { perm:'m:nested:menu1:2', title: '菜单1-2' },
            children: [
              {
                path: 'menu1-2-1',
                name: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                meta: { perm:'m:nested:menu1:2:1', title: '菜单1-2-1' }
              },
              {
                path: 'menu1-2-2',
                name: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                meta: { perm:'m:nested:menu1:1:2:2', title: '菜单1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            name: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            meta: { perm:'m:nested:menu1:1:3', title: '菜单1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { perm:'m:nested:menu2', title: '菜单2' }
      }
    ]
  },
  {
    path: '/error',
    name: 'errorPage',
    component: Layout,
    redirect: 'noredirect',
    meta: { perm:'m:error', title: '错误页面', icon: '404' },
    children: [
      { 
        path: '401', 
        name: 'page401', 
        component: () => import('@/views/errorPage/401'), 
        meta: { perm:'m:error:401', title: '401', noCache: true }},
      { 
        path: '404', 
        name: 'page404', 
        component: () => import('@/views/errorPage/404'), 
        meta: { perm:'m:error:404', title: '404', noCache: true }}
    ]
  },
  {
    path: '/inout',
    name: 'inout',
    component: Layout,
    redirect: 'noredirect',
    meta: { perm:'m:inout', title: '导出导入', icon: 'excel' },
    children: [
      { 
        path: 'export', 
        name: 'export', 
        component: () => import('@/views/inout/export'), 
        meta: { perm:'m:inout:export', title: '导出', noCache: true }
      },
      { 
        path: 'uploadExcel', 
        name: 'uploadExcel', 
        component: () => import('@/views/inout/uploadExcel'), 
        meta: { perm:'m:inout:uploadExcel', title: '上传Excel', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

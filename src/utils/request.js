import axios from 'axios'
import { Loading, Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Code from '@/utils/code'

const loadingConfig = {
  lock: true,
  text: '加载中...',
  // spinner: 'el-icon-loading',
	background:'rgba(0, 0, 0, 0.7)',

}
let loadingInstance

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000,                // request timeout
  //withCredentials: true,        // 前端保存cookie时设置为true
  crossDomain: true,
  contentType: 'application/x-www-form-urlencoded'
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['x-token'] = getToken() // 让每个请求携带token-- ['x-token']为自定义key 请根据实际情况自行修改
  }
  // loadingInstance = Loading.service(loadingConfig)
  return config
}, error => {
  // loadingInstance.close()
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  response => {
    // loadingInstance.close()
    console.log("response.data.code = " + response.data.code) // for debug
    if (response.data.code === Code.SUCC) {
      // 如果后台返回的json显示成功，pass
      return response.data
    } else {
      if (response.data.code === Code.UNLOGINED || response.data.code === Code.SESSION_TIMOUT) {
        // 处理登录相关的错误
        // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出',
        //   { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
        //   store.dispatch('FedLogOut').then(() => {
        //     location.reload() // 为了重新实例化vue-router对象 避免bug
        //   })
        // })
        MessageBox.alert('您未登录或登录超时，请重新登录', '提示',
          { confirmButtonText: '确定',  type: 'warning' }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            }
          )
        })
      } else {
        // 其它错误弹出错误信息
        Message({ message: response.data.msg, type: 'error' })
      }
      return Promise.reject('error')
    }
  },

  /**
   * 请求发生错误，一般都是服务器抛异常了
   */
  error => {
    // loadingInstance.close()
    let msg;
    if (error && error.response) {
      switch(error.response.status) {
        case Code.UNAUTHORIZED: //未授权，拒绝访问
          Message({ message: error.response.data.msg, type: 'error' })
          break
        case Code.UNLOGINED:  //未登录
        case Code.SESSION_TIMOUT: //session超时退出了登录
          MessageBox.alert('您未登录或登录超时，请重新登录', '提示',
            { confirmButtonText: '确定',  type: 'warning' }).then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              }
            )
          })
          break
        case Code._400:
          msg = '请求错误(400)'
          break
        case Code._404:
          msg = '请求出错(404)'
          break
        case Code._408:
          msg = '请求超时(408)'
          break
        case Code._500:
          msg = '服务器错误(500)'
          break
        case Code._501:
          msg = '服务未实现(501)'
          break
        case Code._502:
          msg = '网络错误(502)'
          break
        case Code._503:
          msg = '服务不可用(503)'
          break
        case Code._504:
          msg = '网络超时(504)'
          break
        case Code._505:
          msg = 'HTTP版本不受支持(505)'
          break
        default:
          console.error('request err: %o', error)// for debug
          msg = `连接出错(${error.response.status})`
      }
      if (msg) {
        Message({ message: msg, type: 'error' })
      }
    } else {
      console.error('request err: %o', error)// for debug
      Message({ message: '连接服务器失败', type: 'error' })
    }
    return Promise.reject(error)
  }
)

export default service
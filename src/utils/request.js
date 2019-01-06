import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Code from '@/utils/code'

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
  return config
}, error => {
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
    console.log(error.response.status) // for debug
    switch(error.response.status) {
      case Code.UNAUTHORIZED:
        Message({ message: error.response.data.msg, type: 'error' })
        return Promise.reject(error)
      case Code.UNLOGINED:
      case Code.SESSION_TIMOUT:
        MessageBox.alert('您未登录或登录超时，请重新登录', '提示',
          { confirmButtonText: '确定',  type: 'warning' }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            }
          )
        })
        return Promise.reject(error)
      default:
        console.error('request err: %o', error)// for debug
        Message({ message: error.message, type: 'error' })
        return Promise.reject(error)
    }
  }
)

export default service
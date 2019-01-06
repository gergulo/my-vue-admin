import authApi from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import avatorImg from '../../../static/image/avator.gif'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    user_name: '',
    nick_name: '',
    avatar: avatorImg,
    remark: '',
    visitor: false,
    local_test: false,
    roles: [],
    perms: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REMARK: (state, remark) => {
      state.remark = remark
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USER_NAME: (state, user_name) => {
      state.user_name = user_name
    },
    SET_NICK_NAME: (state, nick_name) => {
      state.nick_name = nick_name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMS: (state, perms) => {
      state.perms = perms
    },
    SET_VISITOR: (state, visitor) => {
      state.visitor = visitor
    }
  },

  actions: {
    // 用户名登录
    loginByUserName({ commit }, userInfo) {
      const user_name = userInfo.user_name.trim()
      return new Promise((resolve, reject) => {
        authApi.loginByUserName(user_name, userInfo.password).then(result => {
          commit('SET_TOKEN', result.data.token)
          setToken(result.data.token, result.data.expire * 1000)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        authApi.getUserInfo(state.token).then(result => {
          if (!result) { reject('response is null') }
          if (!result.data) { reject('response.data is null') }
          const data = result.data
          if (!data.perms || data.perms.length === 0) {
            commit('SET_VISITOR', true)
          } else {
            commit('SET_VISITOR', false)
          }
          commit('SET_ROLES', data.roles)
          commit('SET_PERMS', data.perms)
          commit('SET_NICK_NAME', data.nick_name)
          commit('SET_USER_NAME', data.user_name)
          commit('SET_REMARK', data.remark)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        authApi.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    
  }
}

export default user

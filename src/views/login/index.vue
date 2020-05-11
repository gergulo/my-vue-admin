<template>
  <div id="particles-js" class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
             label-position="left">
      <div class="title-container">
        <h3 class="title">登录页面</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input name="user_name" type="text" v-model="loginForm.user_name" autoComplete="on" placeholder="用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container2">
          <svg-icon icon-class="password"/>
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                  autoComplete="on" placeholder="密码"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="showPasswordClass"/>
        </span>
      </el-form-item>
      <el-button type="primary" style="height:47px;width:100%;margin-top:10px;margin-bottom:10px;" :loading="loading"
                 @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
  import {validUserName} from '@/utils/validate'
  import particlesJs from "particles.js";
  import particlesConfig from "../../../static/particles.js/particles.json";

  export default {
    name: 'login',
    data() {
      const validateUserName = (rule, value, callback) => {
        if (!validUserName(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6个字符'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          user_name: '',
          password: ''
        },
        loginRules: {
          user_name: [{required: true, trigger: 'blur', validator: validateUserName}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        passwordType: 'password',
        showPasswordClass: 'eye_off',
        loading: false,
        showDialog: false,
      }
    },
    mounted() {
    	particlesJS("particles-js", particlesConfig)
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
          this.showPasswordClass = 'eye'
        } else {
          this.passwordType = 'password'
          this.showPasswordClass = 'eye_off'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('loginByUserName', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  // $bg: #040813;
  $light_gray: #eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          // box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
          transition-delay: 111111s;
          -webkit-transition-delay: 111111s;
          transition: color 11111s ease-out, background-color 111111s ease-out;
          -webkit-transition: color 11111s ease-out, background-color 111111s ease-out;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url('../../assets/bg.jpg');
    background-repeat: no-repeat;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 420px;
      padding: 30px 30px 30px 30px;
      margin: 100px auto;
      background-image:url('../../assets/main_bg.png'); 
      background-repeat: repeat;
      border-radius:8px;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .svg-container2 {
      padding: 2px 4px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>

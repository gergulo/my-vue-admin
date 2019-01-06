<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>
      <div class="international right-menu-item">
        <span class="welcome_title">欢迎你，{{nick_name}}</span>
      </div>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <svg-icon icon-class="dashboard" style="margin-right:5px;"/>控制台
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="handlePassword"><svg-icon icon-class="password" style="margin-right:5px;"/>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout"><svg-icon icon-class="o_exit" style="margin-right:5px;"/>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--弹出窗口：修改密码-->
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="旧密码" prop="old_password">
          <el-input type="password" v-model="temp.old_password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input type="password" v-model="temp.new_password"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="new_password2">
          <el-input type="password" v-model="temp.new_password2"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePassword">确定</el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import authApi from '@/api/auth'

export default {

  data(){
      let validateOldPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else {
          callback();
        }
      };

      let validateNewPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.temp.new_password2 !== '') {
            this.$refs.dataForm.validateField('new_password2');
          }
          callback();
        }
      };

      let validateNewPassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.temp.new_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

    return {
      dialogVisible: false,
      temp: {
        old_password: '',
        new_password: '',
        new_password2: '',
      },
      rules: {
          old_password: [{required: true, validator: validateOldPassword, trigger: 'blur'}],
          new_password: [{required: true, validator: validateNewPassword, trigger: 'blur'}],
          new_password2: [{required: true, validator: validateNewPassword2, trigger: 'change'}]
      },
    }

  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user_name',
      'nick_name',
      'avatar',
      'roles',
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    handlePassword(){
      this.dialogVisible = true
      this.$nextTick(() => this.$refs['dataForm'].clearValidate())
    },
    updatePassword(){
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) return
        const tempData = Object.assign({}, this.temp)//copy obj
        authApi.updatePwd(tempData).then(result => {
          this.dialogVisible = false
          this.$message.success("修改密码成功")
        })
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 4px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .welcome_title{
    font-size: 16px;
  }
}
</style>

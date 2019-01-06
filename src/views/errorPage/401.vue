<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12" style="padding-left:80px">
        <img :src="img" width="313" height="428">
      </el-col>
      <el-col :span="12">
        <p class="oops">Oops!</p>
        <p class="headline">您没有权限去该页面</p>
        <p class="info">您可以：</p>
        <ul class="info list-unstyled">
          <li>联系系统管理员授权</li>
          <li class="link-type">
            <router-link to="/dashboard">返回控制台</router-link>
          </li>
          <li class="link-type">
            <a @click="back" href="#">返回上一页</a>
          </li>
        </ul>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
import img from '@/assets/401_images/401.gif'

export default {
  name: 'page401',
  data() {
    return {
      img: img + '?' + +new Date(),
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    margin: 40px 100px 40px 100px ;
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      margin-bottom: 20px;
    }
    .headline {
      font-size: 20px;
      line-height: 24px;
      color: #1482f0;
      margin-bottom: 10px;
    }
    .info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
    }
  }
</style>

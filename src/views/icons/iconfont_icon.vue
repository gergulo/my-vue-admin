<template>
  <div class="icons-container">
    <div class="icons-wrapper">
      <div class="icon-item"><i class="el-icon-third-key"></i><span class="icon-text">el-icon-third-key</span></div>
      <div class="icon-item"><i class="el-icon-third-shejishi"></i><span class="icon-text">el-icon-third-shejishi</span></div>
      <div class="icon-item"><i class="el-icon-third-component"></i><span class="icon-text">el-icon-third-component</span></div>
      <div class="icon-item"><i class="el-icon-third-excel"></i><span class="icon-text">el-icon-third-excel</span></div>
      <div class="icon-item"><i class="el-icon-third-password"></i><span class="icon-text">el-icon-third-password</span></div>
      <div class="icon-item"><i class="el-icon-third-message"></i><span class="icon-text">el-icon-third-message</span></div>
      <div class="icon-item"><i class="el-icon-third-shoppingCard"></i><span class="icon-text">el-icon-third-shoppingCard</span></div>
      <div class="icon-item"><i class="el-icon-third-zip"></i><span class="icon-text">el-icon-third-zip</span></div>
      <div class="icon-item"><i class="el-icon-third-tree"></i><span class="icon-text">el-icon-third-tree</span></div>
    </div>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icons-container {
    margin: 10px 20px 0;
    overflow: hidden;
    .icons-wrapper {
      margin: 0 auto;
    }
    .icon-item {
      margin: 10px;
      height: 110px;
      text-align: center;
      width: 160px;
      float: left;
      font-size: 30px;
      color: #606266;
      cursor: pointer;
    }
    span {
      display: block;
      font-size: 20px;
      margin-top: 5px;
    }
    .disabled{
      pointer-events: none;
    }
  }
</style>
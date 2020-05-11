<template>
  <div class="app-container">
    <el-row class="button-bar">
      <!--角色信息-->
      <span >修改角色的权限：<el-tag type="info">{{role.role_name}}</el-tag></span>
      <router-link to="/system/role_manage" style="float:right">
        <el-button type="text" icon="el-icon-back" >返回角色管理页面</el-button>
      </router-link>
    </el-row>
    <el-row :gutter="20" >
      <el-collapse class="page_collapse" accordion>
          <el-collapse-item>
            <template slot="title">
              <el-tooltip class="item" effect="dark" content="点击展开菜单权限元数据信息" placement="top-start">
                <el-tag type="success">菜单权限元数据</el-tag>
              </el-tooltip>
            </template>
            <el-card class="box-card">
              <div slot="header">
                <div class="title-box" style="padding-bottom: 10px;">
                  <span><el-tag type="success">菜单</el-tag>&nbsp;权限元数据</span>
                </div>
                <span class="tips-text">提示：勾选权限即可为角色授权</span>
              </div>
              <el-input class="mgb-15" :placeholder="filterPlaceholderText" v-model="filterMenuPermText"></el-input>
              <el-tree @check-change="handleUpdateMenuPermForRole" show-checkbox ref="menuPermTreeRef" :filter-node-method="filterNode"
                      :data="menuPermissionTree" :props="treeProps" node-key="perm_value" default-expand-all :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <span class="mgl-10">{{ data.perm_name }}</span>
                    <span class="mgl-10 tips-text">{{ data.perm_value }}</span>
                    <el-tag class="mgl-10" type="success" size="mini">菜单</el-tag>
                  </span>
                </span>
              </el-tree>
            </el-card>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title">
              <el-tooltip class="item" effect="dark" content="点击展开按钮权限元数据信息" placement="top-start">
                <el-tag type="primary">按钮权限元数据</el-tag>
              </el-tooltip>
            </template>
            <el-card class="box-card">
              <div slot="header">
                <div class="title-box" style="padding-bottom: 10px;">
                  <span><el-tag type="primary">按钮</el-tag>&nbsp;权限元数据</span>
                </div>
                <span class="tips-text">提示：勾选权限即可为角色授权</span>
              </div>
              <el-input class="mgb-15" :placeholder="filterPlaceholderText" v-model="filterButtonPermText"></el-input>
              <el-tree ref="buttonPermTreeRef" :filter-node-method="filterNode" :data="buttonPermissionTree"
                      :props="treeProps" node-key="perm_value" default-expand-all :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                      <el-checkbox v-if="data.perm_type==permType.BUTTON" v-model="btnCheckboxMap[data.perm_value]"
                                  @change="(checked)=>{handleUpdateBtnPermForRole(checked, data.perm_value)}"></el-checkbox>
                      <span class="mgl-10">{{ data.perm_name }}</span>
                      <span class="mgl-10 tips-text">{{ data.perm_value }}</span>
                      <el-tag class="mgl-10" v-if="data.perm_type==permType.MENU" type="success" size="mini">菜单</el-tag>
                      <el-tag class="mgl-10" v-else-if="data.perm_type==permType.BUTTON" type="primary" size="mini">按钮</el-tag>
                    </span>
                </span>
              </el-tree>
            </el-card>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title">
              <el-tooltip class="item" effect="dark" content="点击展开接口权限元数据信息" placement="top-start">
                <el-tag type="info">接口权限元数据</el-tag>
              </el-tooltip>
            </template>
            <el-card class="box-card">
              <div slot="header">
                <div class="title-box" style="padding-bottom: 10px;">
                  <span><el-tag type="info">接口</el-tag>&nbsp;权限元数据</span>
                </div>
                <span class="tips-text">提示：勾选权限即可为角色授权</span>
              </div>
              <el-input class="mgb-15" :placeholder="filterPlaceholderText" v-model="filterApiPermText"></el-input>
              <el-tree @check-change="handleUpdateApiPermForRole" show-checkbox ref="apiPermTreeRef" :filter-node-method="filterNode"
                      :data="apiPermissionTree" :props="treeProps" node-key="perm_value" default-expand-all :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{node,data}">
                  <span>
                    <span class="mgl-10">{{ data.perm_name }}</span>
                    <span class="mgl-10 tips-text">{{ data.perm_value }}</span>
                    <el-tag class="mgl-10" size="mini" type="info">接口</el-tag>
                  </span>
                </span>
              </el-tree>
            </el-card>
          </el-collapse-item>
        </el-collapse>
    </el-row>
  </div>
</template>

<script>

  import tree from '../tree'
  import {parseTime, resetTemp} from '@/utils'
  import permApi from '@/api/perm'
  import roleApi from '@/api/role'
  import { permType, permTypeMap} from '@/utils/constants'
  import {asyncRouterMap} from '@/router' //路由表，定义了菜单和按钮的元数据，可以用来生成权限控制的菜单按钮树
  import debounce from 'lodash/debounce'

  export default {
    name: 'AssignPerm',
    data() {
      return {
        permType,

        //当前授权的角色
        role_id: null,
        role: {},

        //节点过滤
        filterPlaceholderText: '输入权限名称、权限值过滤',
        filterMenuPermText: '',
        filterButtonPermText: '',
        filterApiPermText: '',

        //角色的权限值
        roleMenuPvals: [],
        roleApiPvals: [],
        roleBtnPvals:[],

        menuPermissionTree: [],//菜单权限树
        buttonPermissionTree: [],//按钮权限树
        apiPermissionTree: [],//菜单权限树
        //挂载到按钮权限树的按钮权限数据。由于按钮权限在菜单权限下，key是菜单权限值，value是按钮权限
        btnPermMap:{},

        treeProps: {
          label: 'perm_name',
          children: 'children'
        },
      }
    },

    computed:{
      btnCheckboxMap(){
        let map = {}
        this.roleBtnPvals.forEach(perm_value=>{
          map[perm_value] = true
        })
        return map;
      },
    },

    watch: {
      'filterMenuPermText': debounce(function (val) {
        this.$refs.menuPermTreeRef.filter(val);
      }, 600),
      'filterButtonPermText': debounce(function (val) {
        this.$refs.buttonPermTreeRef.filter(val);
      }, 600),
      'filterApiPermText': debounce(function (val) {
        this.$refs.apiPermTreeRef.filter(val);
      }, 600),
    },

    created() {
      this.initData()
    },

    methods: {

      //获取后台权限数据
      initData() {
        //获取路由中的角色id
        this.role_id = this.$route.params.role_id
        //显示菜单权限树
        this.menuPermissionTree = tree.generateMenuPermissionTree()
        //显示按钮权限树
        let menuPermissionTreeCopy = tree.generateMenuPermissionTree()
        this.generateButtonPermissionTree(menuPermissionTreeCopy)
        //显示接口权限树
        this.loadApiPermissionTree()
        //加载角色的权限
        this.loadRolePerms()
      },

      /**
       * 加载角色的权限并回显
       */
      loadRolePerms(){
        if(!this.role_id){
          this.$message.error('无法显示角色的权限信息：找不到角色id')
          return;
        }
        roleApi.getRolePerms(this.role_id).then(result=>{
          if(result.data.api_perm_values.length > 0){
            this.roleApiPvals = result.data.api_perm_values
            this.$refs.apiPermTreeRef.setCheckedKeys(result.data.api_perm_values)
          }
          if(result.data.menu_perm_values.length > 0){
            this.roleMenuPvals = result.data.menu_perm_values
            this.$refs.menuPermTreeRef.setCheckedKeys(result.data.menu_perm_values)
          }
          //用于回显角色的按钮权限
          this.roleBtnPvals = result.data.btn_perm_values
          //显示当前修改的角色
          this.role = result.data.role
        })
      },

      /**
       * 过滤节点
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.perm_name.indexOf(value) !== -1 || data.perm_value.indexOf(value) !== -1 ;
      },

      /////////////////////////// 接口权限树

      /**
       * 从服务器端加载接口权限树
       */
      loadApiPermissionTree(){
        permApi.listApiPermLGroup().then(result=>{
          this.apiPermissionTree = result.data.apiPermMap
        })
      },

      /////////////////////////// 按钮权限树

      /**
       * 递归生成按钮权限树
       */
      generateButtonPermissionTree(menuPermissionTreeCopy) {
        permApi.listBtnPermGroupByParent().then(result=>{
          this.btnPermMap = result.data.btnPermMap || {}
          this.buttonPermissionTree = tree.mapToButtonPermissionTree(this.btnPermMap, menuPermissionTreeCopy)
        })

      },

      /**
       * 修改角色的按钮权限
       * @param checked
       */
      handleUpdateBtnPermForRole(checked, perm_value){
        let data = {
          role_id: this.role_id,
          perm_value: perm_value,
          perm_type: permType.BUTTON
        }
        if(checked){
          roleApi.addRolePerm(data).then(result=>{
            this.roleBtnPvals.unshift(perm_value)
            this.$message.success('添加按钮权限成功')
          })
        }else{
          roleApi.deleteRolePerm(data).then(result=>{
            let index = this.roleBtnPvals.findIndex(btnPval => btnPval == perm_value)
            this.roleBtnPvals.splice(index, 1)
            this.$message.success('删除按钮权限成功')
          })
        }
      },

      /**
       * 修改角色的菜单权限
       */
      handleUpdateMenuPermForRole: debounce(function(){
        let checkedNodes = this.$refs.menuPermTreeRef.getCheckedNodes();
        let perm_values = checkedNodes.map(perm => perm.perm_value)
        if(this.roleMenuPvals.length == perm_values.length) return;
        //发送请求修改角色的权限
        let data = {
          role_id: this.role_id,
          perm_type: permType.MENU,
          perm_values: perm_values
        }
        roleApi.updateRolePerms(data).then(result=>{
          this.roleMenuPvals = perm_values
          this.$message.success('修改菜单权限成功')
        })
      },800),

      /**
       * 修改角色的接口权限
       */
      handleUpdateApiPermForRole: debounce(function(){
        let checkedNodes = this.$refs.apiPermTreeRef.getCheckedNodes();
        let perm_values = checkedNodes.map(perm => perm.perm_value)
        if(this.roleApiPvals.length == perm_values.length) return;
        //发送请求修改角色的权限
        let data = {
          role_id: this.role_id,
          perm_type: permType.API,
          perm_values: perm_values
        }
        roleApi.updateRolePerms(data).then(result=>{
          this.roleApiPvals = perm_values
          this.$message.success('修改接口权限成功')
        })
      }, 800),
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .card-title {
    line-height: 50px;
    height: 50px;
  }

  .tips-text {
    font-size: 14px;
    color: #909399;
  }

  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 22px;
    }
  }

  .update-btn {
    margin-left: 20px;
  }

  .delete-btn {
    margin-left: 20px;
    color: #F56C6C;
  }

  .mgl-10 {
    margin-left: 10px;
  }

  .mgb-15 {
    margin-bottom: 15px;
  }

  .page-title{
    font-size: 24px;
    font-weight: bold;
    color: #303133;
  }

  .page_collapse {
    margin: 0px 20px 0px 20px;
  }
</style>

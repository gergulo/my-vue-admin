<template>
  <div class="app-container">

    <el-row :gutter="20">
      <el-collapse class="page_collapse" accordion>
        <el-collapse-item>
          <template slot="title">
            <el-tooltip class="item" effect="dark" content="点击展开菜单权限元数据信息" placement="top-start">
              <el-tag type="success">菜单权限元数据</el-tag>
            </el-tooltip>
          </template>
          <el-card class="box-card">
            <div slot="header">
              <div class="title-box">
                <span><el-tag type="success" >菜单</el-tag>&nbsp;权限元数据</span>
                <el-tooltip content="同步菜单权限数据" placement="top">
                  <el-button style="font-size: 25px;" type="text" @click="handleSyncMenuPermissionData" icon="el-icon-refresh" circle v-perm="'b:perm:syncMenuPerms'"></el-button>
                </el-tooltip>
              </div>
              <span class="tips-text">提示：菜单权限由页面路由定义，不提供任何修改功能，只能执行将权限数据同步到数据库的操作。
                菜单权限值建议使用前缀&nbsp;<el-tag size="mini" type="success">m:</el-tag>
              </span>
            </div>
            <el-input class="mgb-15" :placeholder="filterPlaceholderText" v-model="filterMenuPermText"></el-input>
            <el-tree ref="menuPermTreeRef" :filter-node-method="filterNode" :data="menuPermissionTree"
                    :props="treeProps" node-key="perm_value" default-expand-all :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <span class="mgl-10">{{ data.perm_name }}</span>
                  <span class="mgl-10 tips-text">{{ data.perm_value }}</span>
                  <el-tag class="mgl-10" type="success" size="mini">菜单</el-tag>
                  <el-tag v-if="!menuPermValSet.has(data.perm_value)" class="mgl-10" type="danger" size="mini">未同步</el-tag>
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
              <div class="title-box">
                <span><el-tag type="primary" >按钮</el-tag>&nbsp;权限元数据</span>
              </div>
              <span class="tips-text">提示：按钮权限是依附在菜单权限下的，这样能帮助您更好区分相似的按钮权限。
                按钮权限值建议使用前缀&nbsp;<el-tag size="mini" type="primary">b:</el-tag>
              </span>
            </div>
            <el-input class="mgb-15" :placeholder="filterPlaceholderText" v-model="filterButtonPermText"></el-input>
            <el-tree ref="buttonPermTreeRef" :filter-node-method="filterNode" :data="buttonPermissionTree"
                    :props="treeProps" node-key="perm_value" default-expand-all :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <span class="mgl-10">{{ data.perm_name }}</span>
                    <span class="mgl-10 tips-text">{{ data.perm_value }}</span>
                    <el-tag class="mgl-10" v-if="data.perm_type==permType.MENU" type="success" size="mini">菜单</el-tag>
                    <el-tag class="mgl-10" v-else-if="data.perm_type==permType.BUTTON" type="primary" size="mini">按钮</el-tag>
                    <el-tooltip v-if="data.perm_type==permType.MENU" content="添加权限" placement="top">
                      <el-button type="text" size="mini" icon="el-icon-plus" @click="handleAddPerm('button', data)" v-perm="'b:perm:add'"></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="data.perm_type==permType.BUTTON" content="修改" placement="top">
                      <el-button class="update-btn" type="text" size="mini" icon="el-icon-edit" @click="handleUpdatePerm('button', data)"  v-perm="'b:perm:update'"></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="data.perm_type==permType.BUTTON" content="删除" placement="top">
                      <el-button class="delete-btn" type="text" size="mini" icon="el-icon-delete" @click="handleDelelePerm(data)"  v-perm="'b:perm:delete'"></el-button>
                    </el-tooltip>
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
              <div class="title-box">
                <span><el-tag type="info">接口</el-tag>&nbsp;权限元数据</span>
              </div>
              <span class="tips-text">提示：接口权限值建议使用前缀&nbsp;<el-tag size="mini" type="info">a:</el-tag>
              </span>
            </div>
            <el-input class="mgb-15" :placeholder="filterPlaceholderText" v-model="filterApiPermText"></el-input>
            <el-tree ref="apiPermTreeRef" :filter-node-method="filterNode" :data="apiPermissionTree"
                    :props="treeProps" node-key="perm_value" default-expand-all :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{node,data}">
                <span>
                  <span class="mgl-10">{{ data.perm_name }}</span>
                  <span class="mgl-10 tips-text">{{ data.perm_value }}</span>
                  <el-tag class="mgl-10" size="mini" type="info">接口</el-tag>
                    <el-tooltip content="添加" placement="top">
                      <el-button type="text" size="mini" icon="el-icon-plus" @click="handleAddPerm('api', data)" v-perm="'b:perm:add'"></el-button>
                    </el-tooltip>
                    <el-tooltip content="修改" placement="top">
                      <el-button class="update-btn" type="text" size="mini" icon="el-icon-edit" @click="handleUpdatePerm('api', data)"  v-perm="'b:perm:update'"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                      <el-button class="delete-btn" type="text" size="mini" icon="el-icon-delete" @click="handleDelelePerm(data)"  v-perm="'b:perm:delete'"></el-button>
                    </el-tooltip>
                  </span>
              </span>
            </el-tree>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-row>

    <!--弹窗：新增或修改权限-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" >
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="权限名" prop="perm_name">
          <el-input v-model="temp.perm_name" placeholder="例如：用户管理、添加用户"></el-input>
        </el-form-item>
        <el-form-item label="权限值" prop="perm_value">
          <el-input v-model="temp.perm_value" placeholder="已自动加上前缀，您只需填剩余部分，如：user:manage、user:add" :disabled="dialogStatus=='updateButton'||dialogStatus=='updateApi'">
            <template slot="prepend" v-if="dialogStatus=='addButton'||dialogStatus=='addApi'">{{permPrefixtMap[permStatus]}}</template>
          </el-input>
          <span class="tips-text" v-if="dialogStatus=='updateButton'||dialogStatus=='addButton'" >提示：按钮权限值建议使用前缀&nbsp;<el-tag size="mini" type="primary" >b:</el-tag></span>
          <span class="tips-text" v-if="dialogStatus=='updateApi'||dialogStatus=='addApi'" >提示：接口权限值建议使用前缀&nbsp;<el-tag size="mini" type="info" >a:</el-tag></span>
        </el-form-item>
        <el-form-item label="父级权限值" prop="parent">
          <el-input v-model="temp.parent" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="perm_type">
          <el-select v-model="temp.perm_type" :disabled="true">
            <el-option label="按钮" :value="permType.BUTTON"></el-option>
            <el-option label="接口" :value="permType.API"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='addButton'||dialogStatus=='addApi'" type="primary" @click="addPerm">确定</el-button>
        <el-button v-if="dialogStatus=='updateButton'||dialogStatus=='updateApi'" type="primary" @click="updatePerm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import tree from '../tree'
  import {parseTime, resetTemp} from '@/utils'
  import permApi from '@/api/perm'
  import {
    confirm,
    permType,
    permTypeMap
  } from '@/utils/constants'
  import {asyncRouterMap} from '@/router' //路由表，定义了菜单和按钮的元数据，可以用来生成权限控制的菜单按钮树
  import debounce from 'lodash/debounce'

  export default {
    name: 'PermManage',
    data() {
      return {

        permPrefixtMap: {
          button: 'b:',
          api: 'a:',
        },

        filterPlaceholderText: '输入权限名称、权限值过滤',

        menuPermValSet: new Set(),
        apiPermValSet: new Set(),

        btnPermMap:{},//按parent字段分组的map

        menuPermissionTree: [],//菜单权限树
        buttonPermissionTree: [],//菜单权限树
        apiPermissionTree: [],//菜单权限树

        filterMenuPermText: '',
        filterButtonPermText: '',
        filterApiPermText: '',

        permType,

        treeProps: {
          label: 'perm_name',
          children: 'children'
        },

        dialogFormVisible: false,
        dialogStatus: '',
        permStatus: '',
        textMap: {
          addButton: '添加按钮权限',
          updateButton: '修改按钮权限',
          deleteButton: '删除按钮权限',
          addApi: '添加接口权限',
          updateApi: '修改接口权限',
          deleteAPi: '删除接口权限',
        },
        temp: {
          idx: null,
          pid: null,
          perm_name: null,
          perm_type: null,
          perm_value: null,
          leaf: null,
          parent: null
        },
        rules: {
          perm_name: [{required: true, message: '必填', trigger: 'blur'}],
          perm_type: [{required: true, message: '必填', trigger: 'blur'}],
          perm_value: [{required: true, message: '必填', trigger: 'change'}]
        },
      }
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
        permApi.listAllPerms().then(res => {
          //按parent分组的按钮权限
          this.btnPermMap = res.data.btnPermMap || {}
          //含有所有权限map，key是perm_type
          let permMap = res.data.permMap || {}
          //后台存储的所有菜单权限，用于比较前后台数据是否同步
          let menuPermList = permMap[permType.MENU] || []
          this.menuPermValSet = new Set(menuPermList.map(p=>p.perm_value))
          //后台存储的所有接口权限，用于比较数据是否同步
          let apiPermList = permMap[permType.API] || []
          this.apiPermValSet = new Set(apiPermList.map(p=>p.perm_value))
          //显示菜单权限树
          this.menuPermissionTree = tree.generateMenuPermissionTree()
          //显示按钮权限树
          let menuPermissionTreeCopy = tree.generateMenuPermissionTree()
          this.buttonPermissionTree = this.generateButtonPermissionTree(menuPermissionTreeCopy)
          //显示接口权限树
          this.loadApiPermissionTree()
        })
      },

      /**
       * 过滤节点
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.perm_name.indexOf(value) !== -1 || data.perm_value.indexOf(value) !== -1 ;
      },

      /**
       * 添加权限
       */
      handleAddPerm(perm_type, data) {
        this.permStatus = perm_type;
        resetTemp(this.temp)
        switch(perm_type) {
          case 'button':
            this.dialogStatus = 'addButton';
            this.temp.perm_type = permType.BUTTON;
            break;
          case 'api':
            this.dialogStatus = 'addApi';
            this.temp.perm_type = permType.API;
            break;
        }
        this.temp.parent = data.perm_value
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      addPerm() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return;
          const data = Object.assign({}, this.temp)//copy obj
          data.perm_value = this.permPrefixtMap[this.permStatus] + data.perm_value
          permApi.addPerm(data).then(result => {
            this.dialogFormVisible = false
            this.initData()
            this.$message.success("添加权限成功")
          })
        })
      },

      /**
       * 修改权限
       */
      handleUpdatePerm(perm_type, data) {
        this.permStatus = perm_type;
        switch(perm_type) {
          case 'button':
            this.dialogStatus = 'updateButton';
            break
          case 'api':
            this.dialogStatus = 'updateApi';
            break
        }
        this.temp = Object.assign({}, data) // copy obj
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      updatePerm() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return;
          const data = Object.assign({}, this.temp)//copy obj
          permApi.updatePerm(data).then(result => {
            this.dialogFormVisible = false
            this.initData()
            this.$message.success("修改权限成功")
          })
        })
      },

      /**
       * 删除权限
       */
      handleDelelePerm(data) {
        this.$confirm('您确定要永久删除该权限？', '提示', confirm).then(() => {
          permApi.deletePerm(data).then(result => {
            this.initData()
            this.$message.success("删除权限成功")
          })
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      /**
       * 从服务器端加载接口权限树
       */
      loadApiPermissionTree(){
        permApi.listApiPermLGroup().then(result=>{
          let apiPermMap = [{
            children: result.data.apiPermMap,
            parent: '',
            perm_name: "接口权限虚拟根节点",
            perm_type: permType.API,
            perm_value: "a:root",
          }]
          this.apiPermissionTree = apiPermMap
        })
      },

      /**
       * 递归生成按钮权限树
       */
      generateButtonPermissionTree(menuPermissionTreeCopy) {
        return tree.mapToButtonPermissionTree(this.btnPermMap,menuPermissionTreeCopy)
      },

      ////////////////普通用户修改密码的页面和接口！！！！

      /**
       * 同步菜单权限数据
       */
      handleSyncMenuPermissionData() {
        let list = []
        this.permissionTreeToList(list, this.menuPermissionTree)
        permApi.syncMenuPerms(list).then(result=>{
          this.initData()
          this.$message.success('菜单权限数据同步成功')
        })
      },

      /**
       * 菜单权限树转换成列表形式
       */
      permissionTreeToList(list, tree) {
        tree.forEach(perm => {
          let temp = Object.assign({}, perm)
          temp.children = []
          if (perm.children && perm.children.length > 0) {
            temp.leaf = false
            this.permissionTreeToList(list, perm.children)
          }else{
            temp.leaf = true
          }
          list.push(temp)
        })
      },

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

  .page_collapse {
    margin: 0px 20px 0px 20px;
  }
</style>
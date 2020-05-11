<template>
  <div class="app-container">
    <!--查询-->
    <el-row class="query-bar">
      <el-input class="query-text" v-model="tableQuery.txt" placeholder="搜索角色名或角色值"></el-input>
      <el-tooltip class="item query-button" content="搜索" placement="top">
        <el-button icon="el-icon-search" circle @click="fetchData()"></el-button>
      </el-tooltip>
    </el-row>
    <el-row class="button-bar">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate" v-perm="'b:role:add'">{{textMap.create}}</el-button>
    </el-row>
    <!--列表-->
    <el-table style="width: 100%"
              :data="tableData"
              v-loading.body="tableLoading"
              element-loading-text="加载中"
              border fit highlight-current-row>
      <el-table-column prop="role_name" label="角色名" ></el-table-column>
      <el-table-column prop="role_value" label="角色值" ></el-table-column>
      <el-table-column prop="create_time" label="添加时间" >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.create_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.update_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top" v-perm="'b:role:update'">
            <el-button @click="handleUpdate(scope.$index,scope.row)" size="medium" type="info" icon="el-icon-edit" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="修改权限" placement="top" v-if="!hasAdminRole(scope.row)" v-perm="'b:role:perm'">
            <el-button @click="handleUpdateRolePerms(scope.$index,scope.row)" size="medium" type="warning" icon="el-icon-third-key" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" v-if="!hasAdminRole(scope.row)" v-perm="'b:role:delete'">
            <el-button @click="handleDelete(scope.$index,scope.row)" size="medium" type="danger" icon="el-icon-delete" circle plain></el-button>
          </el-tooltip>
          <el-popover trigger="hover" placement="top" v-else style="display: inline-block;">
            <el-alert type="warning" :closable="false" title="权限说明">
              <div>为保证超级管理员在系统中的最高权限</div>
              <div>不允许修改超级管理员自身的权限</div>
              <div>不允许删除超级管理员角色</div>
            </el-alert>
            <div slot="reference" >
              <el-tag style="margin-left: 10px;" type="info">权限说明</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tablePage.current"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="tablePage.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tablePage.total">
    </el-pagination>
    <!--弹出窗口：修改角色-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px" >
        <el-form-item label="角色名" prop="role_name" >
          <el-input v-model="temp.role_name"></el-input>
        </el-form-item>
        <el-form-item label="角色值" prop="role_value">
          <el-input v-model="temp.role_value" :disabled="dialogStatus=='update'"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import roleApi from '@/api/role'
  import { parseTime, resetTemp } from '@/utils'
  import { pageParamNames, confirm, root } from '@/utils/constants'
  import debounce from 'lodash/debounce'

  export default {
    name: 'RoleManage',
    data() {
      return {
        tableLoading:false,
        tableData: [],
        tableQuery:{
          txt: ''
        },
        tablePage: {
          current: 1,
          pages: 0,
          size: 10,
          total: 0
        },
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {
          idx: 0,//表格的下标
          id: 0,
          role_name: '',
          remark: '',
          role_value: '',
          create_time: null,
          update_time: null
        },
        textMap: {
          update: '修改角色',
          create: '添加角色'
        },
        rules: {
          role_name: [{ required: true, message: '必填', trigger: 'blur' }],
          role_value: [{ required: true, message: '必填', trigger: 'blur' }]
        },
      }
    },

    created(){
      this.fetchData()
    },

    watch:{
      //延时查询
      'tableQuery.txt': debounce( function(){
        this.fetchData()
      },500),
    },//watch

    methods: {
      parseTime,
      hasAdminRole(row){
        return row && row.role_value==root.role_value
      },
      //分页
      handleSizeChange(val) {
        this.tablePage.size = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.tablePage.current = val;
        this.fetchData();
      },
      //查询
      fetchData() {
        this.tableLoading = true
        roleApi.queryRole(this.tableQuery,this.tablePage).then(result => {
          this.tableData = result.data.page.records
          this.tableLoading = false
          pageParamNames.forEach(name => this.$set(this.tablePage, name, result.data.page[name]))
        }, error => {
          this.tableData = []
          this.tableLoading = false
        })
      },

      //添加
      handleCreate() {
        resetTemp(this.temp)
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return;
          roleApi.addRole(this.temp).then((result) => {
              this.temp.id = result.data.id;//后台传回来添加记录的id
              this.temp.create_time = result.data.create_time;//后台传回来添加记录的时间
              this.temp.update_time = result.data.update_time
              this.tableData.unshift(Object.assign({},this.temp))
              ++this.tablePage.total
              this.dialogFormVisible = false
              this.$message.success('添加角色成功')
            })
        })
      },

      //修改
      handleUpdate(idx,row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.idx = idx
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return;
            const tempData = Object.assign({}, this.temp)//copy obj
            roleApi.updateRole(tempData).then(result => {
              tempData.update_time = result.data.update_time
              this.tableData.splice(tempData.idx, 1, tempData)
              this.dialogFormVisible = false
              this.$message.success('修改角色信息成功')
            })
        })
      },

      //修改用户的角色
      handleUpdateRolePerms(idx, row) {
        this.$router.push({path:'/system/role_manage/' + row.id + '/assign_perm'})
      },

      //删除
      handleDelete(idx,row) {
        this.$confirm('您确定要永久删除该用户？', '提示', confirm).then(() => {
          roleApi.deleteRole( {id : row.id} ).then(result => {
            this.tableData.splice(idx, 1)
            --this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success('删除角色成功')
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
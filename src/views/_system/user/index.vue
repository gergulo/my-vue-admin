<template>
  <div class="app-container">
    <!--查询  -->
    <el-row class="query-bar">
      <el-input class="query-text" v-model="tableQuery.txt" placeholder="搜索用户名或昵称"></el-input>
      <el-tooltip class="item query-button" content="搜索" placement="top">
        <el-button icon="el-icon-search" circle @click="fetchData(1)" v-perm="'b:user:query'"></el-button>
      </el-tooltip>
    </el-row>
    <el-row class="button-bar">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate" v-perm="'b:user:add'">{{textMap.create}}</el-button>
    </el-row>
    <!--列表-->
    <el-table style="width: 100%"
              :data="tableData"
              v-loading.body="tableLoading"
              element-loading-text="加载中"
              border fit highlight-current-row>
      <el-table-column width="150" prop="user_name" label="用户名"></el-table-column>
      <el-table-column width="150" prop="nick_name" label="昵称"></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <el-tag style="margin: 2px;" v-for="role in scope.row.roleList" :key="role.id">{{role.role_name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="60" prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" prop="create_time" label="添加时间">
        <template slot-scope="scope">
          <span v-text="parseTime(scope.row.create_time)"></span>
        </template>
      </el-table-column>
      <el-table-column width="160" prop="update_time" label="修改时间">
        <template slot-scope="scope">
          <span v-text="parseTime(scope.row.update_time)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top" v-if="!hasAdminRole(scope.row)" v-perm="'b:user:update'">
            <el-button @click="handleUpdate(scope.$index,scope.row)" size="medium" type="info" icon="el-icon-edit" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="修改密码" placement="top" v-perm="'b:user:pwd'">
            <el-button @click="handlePassword(scope.$index,scope.row)" size="medium" type="info" icon="el-icon-third-password" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="修改角色" placement="top" v-if="!hasAdminRole(scope.row)" v-perm="'b:user:userrole'">
            <el-button @click="handleUpdateUserRoles(scope.$index,scope.row)" size="medium" type="warning" icon="el-icon-third-shejishi" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" v-if="!hasAdminRole(scope.row)" v-perm="'b:user:delete'">
            <el-button @click="handleDelete(scope.$index,scope.row)" size="medium" type="danger" icon="el-icon-delete" circle plain></el-button>
          </el-tooltip>
          <el-popover trigger="hover" placement="top" v-else style="display: inline-block;">
            <el-alert type="warning" :closable="false" title="权限说明">
              <div>为保证超级管理员在系统中的最高权限</div>
              <div>不允许修改超级管理员自身的角色</div>
              <div>不允许删除超级管理员用户</div>
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
    <!--弹出窗口：添加/修改用户-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="temp.user_name"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-model="temp.nick_name"></el-input>
        </el-form-item>
        <el-form-item label="备注描述" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
    <!--弹出窗口：修改密码-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="editPasswordFormVisible" width="40%">
      <el-form :rules="rules" ref="passwordForm" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="temp.user_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input type="password" v-model="temp.new_password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="new_password2">
          <el-input type="password" v-model="temp.new_password2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPasswordFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePassword">保存</el-button>
      </div>
    </el-dialog>
    <!--弹出窗口：修改用户角色-->
    <el-dialog title="修改用户的角色" :visible.sync="editRolesDialogVisible" width="40%">
      <div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="userRoles.role_ids">
          <el-checkbox class="role-checkbox" v-for="role in roleOptions" :label="role.id" :key="role.id">
            {{role.role_name}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="checkUpdateUserRoles">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import roleApi from '@/api/role'
  import userApi from '@/api/user'
  import {parseTime, resetTemp} from '@/utils'
  import {root, confirm, pageParamNames, statusMap} from '@/utils/constants'
  import debounce from 'lodash/debounce'

  export default {

    name: 'UserManage',

    data() {

      let validateUserName = (rule, value, callback) => {
        if (value === '') {
          console.log(value);
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };

      let validateNewPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.temp.new_password2 !== '') {
            this.$refs.passwordForm.validateField('new_password2');
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
        parseTime: parseTime,
        tableLoading: false,
        tableData: [],
        tableQuery: {
          txt: ''
        },
        tablePage: {
          current: 1,
          pages: 0,
          size: 10,
          total: 0
        },
        dialogFormVisible: false,
        editRolesDialogVisible: false,
        editPasswordFormVisible: false,
        dialogStatus: '',
        temp: {
          idx: 0, //tableData中的下标
          id: 0,
          user_name: '',
          nick_name: '',
          remark: '',
          status: 0,
          new_password: '',
          new_password2: '',
          create_time: null,
          update_time: null,
          roleList: []
        },
        textMap: {
          update: '修改用户',
          create: '添加用户',
          password: '修改密码'
        },
        rules: {
          user_name: [{required: true, validator: validateUserName, trigger: 'blur'}],
          new_password: [{required: true, validator: validateNewPassword, trigger: 'blur'}],
          new_password2: [{required: true, validator: validateNewPassword2, trigger: 'change'}]
        },
        checkAll: false,
        isIndeterminate: true,
        //所有角色(管理员除外)
        roleOptions:[],
        roleMap: new Map(),
        roleMap2: new Map(),
        // 修改用户的角色的数据
        userRoles: {
          idx: 0,
          user_id: 0,
          role_ids: []
        },
      }

    },

    created() {
      this.initData()
      this.fetchData()
    },

    watch: {
      //延时查询
      'tableQuery.txt': debounce(function () {
        this.fetchData(1)
      }, 500)
    },//watch

    filters: {
      statusFilter(status) {
        return statusMap.get(status)
      }
    },

    methods: {

      initData(){
        //所有角色
        roleApi.listAllRole().then(result => {
          result.data.roles.forEach(obj => {
            if(obj.role_value != root.role_value){  //排除管理员
              this.roleOptions.push(obj)
              this.roleMap.set(obj.id, obj.role_value)
              this.roleMap2.set(obj.id, obj.role_name)
            }
          })
        })
      },

      hasAdminRole(row){
        if(row && row.roleList){
          return row.roleList.some(role => role.role_value == root.role_value)
        }
        return false
      },

      //全选
      handleCheckAllChange(val) {
        let allRoleIds = this.roleOptions.map(role => role.id)
        this.userRoles.role_ids = val ? allRoleIds : [];
        this.isIndeterminate = false;
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
      fetchData(current) {
        if(current){
          this.tablePage.current = current
        }
        this.tableLoading = true
        userApi.queryUser(this.tableQuery, this.tablePage).then(result => {
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
          userApi.addUser(this.temp).then((result) => {
            this.temp.id = result.data.id;//后台传回来添加记录的id
            this.temp.create_time = result.data.create_time;//后台传回来添加记录的时间
            this.temp.update_time = result.data.update_time;//后台传回来修改记录的时间
            this.temp.roleList = []
            this.tableData.unshift(Object.assign({},this.temp))
            ++this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success("添加成功")
          })
        })
      },

      //修改
      handleUpdate(idx, row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.idx = idx
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return
          const tempData = Object.assign({}, this.temp)//copy obj
          userApi.updateUser(tempData).then(result => {
            tempData.update_time = result.data.update_time
            this.tableData.splice(tempData.idx, 1, tempData)
            this.dialogFormVisible = false
            this.$message.success("修改成功")
          })
        })
      },

      //修改密码
      handlePassword(idx, row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.idx = idx
        this.temp.new_password = ''
        this.temp.new_password2 = ''
        this.dialogStatus = 'password'
        this.editPasswordFormVisible = true
        this.$nextTick(() => this.$refs['passwordForm'].clearValidate())
      },
      updatePassword() {
        this.$refs['passwordForm'].validate((valid) => {
          if (!valid) return
          const tempData = Object.assign({}, this.temp)//copy obj
          userApi.updatePwd(tempData).then(result => {
            tempData.update_time = result.data.update_time
            this.tableData.splice(tempData.idx, 1, tempData)
            this.editPasswordFormVisible = false
            this.$message.success("修改密码成功")
          })
        })
      },
      
      //修改用户的角色
      handleUpdateUserRoles(idx, row) {
        // 显示用户的角色
        this.userRoles = {
          idx: idx,
          user_id: row.id,
          role_ids: row.roleList.map(role => role.id)
        }
        // 显示弹窗
        this.editRolesDialogVisible = true
      },

      checkUpdateUserRoles() {
        const noRolesSelected = this.userRoles && this.userRoles.role_ids && this.userRoles.role_ids.length ==0;
        if(noRolesSelected){
          this.$confirm('当前没有选中任何角色，会清除该用户已有的角色, 是否继续?', '提示', confirm).then(() => {
            this.updateUserRoles()
          }).catch(() => {
            this.$message("已取消修改用户角色");
          });
        }else{
          this.updateUserRoles()
        }
      },

      updateUserRoles(){
        userApi.updateUserRoles(this.userRoles).then(result => {
          let new_roles = this.userRoles.role_ids.map(role_id=>{
            let role_name = this.roleMap2.get(role_id);
            if(role_id) return {'id': role_id, 'role_name': role_name}
          })
          this.tableData[this.userRoles.idx].roleList = new_roles
          this.editRolesDialogVisible = false
          this.$message.success("修改成功")
        })
      },

      //删除
      handleDelete(idx, row) {
        this.$confirm('您确定要永久删除该用户？', '提示', confirm).then(() => {
          userApi.deleteUser({id: row.id}).then(result => {
            this.tableData.splice(idx, 1)
            --this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success("删除成功")
          })
        }).catch(() => {
          this.$message.info("已取消删除")
        });

      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .role-checkbox{
    margin-left: 0px;
    margin-right: 15px;
  }
</style>
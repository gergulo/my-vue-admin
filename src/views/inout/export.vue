<template>
  <div class="app-container">
    <el-row class="button-bar">
      <el-button type="primary" icon="el-icon-third-excel" size="mini" @click="handleExportExcel" :loading="downloadExcelLoading">导出 excel</el-button>
      <el-button type="primary" icon="el-icon-third-zip" size="mini" @click="handleExportZip" :loading="downloadZipLoading">导出 zip</el-button>
    </el-row>
    <!--列表-->
    <el-table style="width: 100%"
              :data="tableData"
              ref="multipleTable"
              v-loading.body="tableLoading"
              element-loading-text="加载中"
              border fit highlight-current-row
               @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
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
    </el-table>
  </div>
</template>

<script>

  import roleApi from '@/api/role'
  import userApi from '@/api/user'
  import {parseTime, resetTemp} from '@/utils'
  import {root, confirm, pageParamNames, statusMap} from '@/utils/constants'
  import debounce from 'lodash/debounce'

  export default {

    name: 'export',

    data() {

      return {
        downloadExcelLoading: false,
        downloadZipLoading: false,
        filename: 'a',
        autoWidth: true,

        parseTime: parseTime,
        tableLoading: false,
        tableData: [],
        //所有角色(管理员除外)
        roleOptions:[],
        tablePage: {
          current: 1,
          pages: 0,
          size: 10,
          total: 0
        },
        multipleSelection: [],
      }

    },

    created() {
      this.initData()
      this.fetchData()
    },

    filters: {
      statusFilter(status) {
        return statusMap.get(status)
      }
    },

    methods: {

      initData(){
        //所有角色选项
        roleApi.listAllRole().then(result => {
          result.data.roles.forEach(obj => {
            if(obj.role_value != root.role_value){  //排除管理员
              this.roleOptions.push(obj)
            }
          })
        })
      },


      //查询
      fetchData(current) {
        if(current){
          this.tablePage.current = current
        }
        this.tableLoading = true
        userApi.queryUser('', this.tablePage).then(result => {
          this.tableData = result.data.page.records
          this.tableLoading = false
        }, error => {
          this.tableData = []
          this.tableLoading = false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleExportExcel() {
        if (this.multipleSelection.length) {
          this.downloadExcelLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const data = this.getData()
            excel.export_json_to_excel(data)
            this.$refs.multipleTable.clearSelection()
            this.downloadExcelLoading = false
          })
        } else {
          this.$message({
            message: '请至少选择一条记录',
            type: 'warning'
          })
        }
      },
      handleExportZip() {
        if (this.multipleSelection.length) {
          this.downloadZipLoading = true
          import('@/vendor/Export2Zip').then(zip => {
            const data = this.getData()
            zip.export_txt_to_zip(data.header, data.data, data.filename, data.filename)
            this.$refs.multipleTable.clearSelection()
            this.downloadZipLoading = false
          })
        } else {
          this.$message({
            message: '请至少选择一条记录',
            type: 'warning'
          })
        }
      },
      formatData(filterVal, data) {
        return data.map(v => filterVal.map(j => v[j]))
      },
      formatFiled(v) {
        let role_names = []
        v['roleList'].forEach(o => role_names.push(o.role_name))
        v['role_names'] = role_names.join("|")
        v['status_text'] = statusMap.get(v['status'])
        return v
      },
      getData() {
        const header = ['用户名', '昵称', '角色', '状态', '添加时间', '修改时间']
        const filterVal = ['user_name', 'nick_name', 'role_names', 'status_text', 'create_time', 'update_time']
        //这里会改变原始表格数据
        let list = this.multipleSelection.map(
          v => this.formatFiled(v)
        )
        const data = this.formatData(filterVal, list)
        return {
          header: header,
          data: data,
          filename: this.filename,
          autoWidth: this.autoWidth
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>



<template>
  <div class="margin_top_table">
    <div class="equip_height">
      <span class="warm_name">温室列表</span>
      <i class="el-icon-circle-plus-outline" style="margin: 5px;cursor: pointer" title="添加温室" @click="display_warm_add = true"></i>
    </div>
    <el-table
      :data="listGreen"
      border
      style="width: 840px; margin-left: 20px;">
      <el-table-column
        prop="num"
        label="序号"
        width="220px">
      </el-table-column>
      <el-table-column
        prop="greenHouseName"
        label="温室名称"
        width="220px">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="温室拥有者"
        width="220px">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160px">
        <template slot-scope="scope" >
          <el-button type="text" size="small" class="cell_chg_cel cell_chg" @click="chg_warm(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="sensor_del cell_chg_cel cell_del"  @click="del_warm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="display_warm" :before-close="handleClose">
      <div>
        <div class="equip_form">
          <el-form label-width="120px" class="demo-ruleForm">
            <el-form-item label="温室名">
              <el-input v-model="warm_name" placeholder="自定义"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="display_warm = false">取 消</el-button>
        <el-button type="primary" @click="pre_warm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="display_warm_add" :before-close="handleClose">
      <div>
        <div class="equip_form">
          <el-form label-width="120px" class="demo-ruleForm">
            <el-form-item label="温室名">
              <el-input v-model="warm_name_add" placeholder="自定义"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="display_warm_add = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: window.sessionStorage.getItem('username'),
      password: window.sessionStorage.getItem('password'),
      listGreen: [],
      warm_name: '',
      warmid: '',
      warm_name_add: '',
      display_warm: false,
      display_warm_add: false
    }
  },
  methods: {
    // 温室列表
    GreenList () {
      this.listGreen = []
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      this.axios.post(this.$store.state.ip + 'gh/allGreenHouse', formdata).then(res => {
        let test = res.data
        for (let i = 0; i < test.length; i++) {
          this.listGreen.push(test[i])
          this.listGreen[i].num = i + 1
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开弹窗， 初始化温室
    chg_warm (row) {
      this.display_warm = true
      this.warm_name = row.greenHouseName
      this.warmid = row.greenHouseId
    },
    // 删除 温室
    del_warm (row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formdata = new FormData()
        formdata.append('userName', this.username)
        formdata.append('password', this.password)
        formdata.append('greenHouseId', row.greenHouseId)
        this.axios.post(this.$store.state.ip + 'gh/delete', formdata).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.GreenList()
        }).catch(err => {
          console.log(err)
          this.$message.success('修改失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info'
        })
      })
    },
    // 更改 温室名
    pre_warm () {
      this.display_warm = false
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('greenHouseId', this.warmid)
      formdata.append('greenHouseName', this.warm_name)
      this.axios.post(this.$store.state.ip + 'gh/modifyName', formdata).then(res => {
        if (res.data === 1) {
          this.$message.success('修改成功')
          this.GreenList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加温室
    onSubmit () {
      this.display_warm_add = false
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('greenHouseName', this.warm_name_add)
      this.axios.post(this.$store.state.ip + 'gh/add', formdata).then(res => {
        if (res.data === 1) {
          this.$message.success('添加成功')
          this.warm_name_add = ''
          this.GreenList()
        }
      }).catch(err => {
        console.log(err)
        this.$message.success('添加失败')
      })
    },
    // 弹窗
    handleClose (done) {
      this.$confirm('确定关闭吗').then(() => {
        // function(done)，done 用于关闭 Dialog
        done()
      }).catch(() => {
      })
    }
  },
  created () {
    this.GreenList()
  }
}
</script>

<style scoped>
  .margin_top_table {
    margin-top: 20px;
  }
  .equip_height {
    margin-bottom: 20px;
    margin-left: 30px;
    padding-left: 10px;
    text-align: left;
  }
  .warm_name {
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }
  .cell_chg_cel {
    font-size: 12px;
    cursor: pointer;
  }
  .cell_chg {
    color: #409EFF;
    margin-left: 10px;
    margin-right: 5px;
  }
  .cell_del{
    color: #F56C6C;
    margin-left: 5px;
  }
  .equip_form {
    width: 450px;
    margin-left: 20px;
    margin-top: 30px;
  }
</style>

<template>
  <div>
    <el-table
      :data="listEquip"
      border
      style="width: 1100px; margin-left: 20px;">
      <el-table-column
        prop="num"
        label="序号"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="devName"
        label="设备名"
        width="240px">
      </el-table-column>
      <el-table-column
        prop="devEUI"
        label="终端串号"
        width="240px">
      </el-table-column>
      <el-table-column
        prop="devType"
        label="设备类型"
        width="230px">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160px">
        <template slot-scope="scope" >
          <el-button type="text" size="small" class="cell_chg_cel cell_chg" @click="chg_equip(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="sensor_del cell_chg_cel cell_del"  @click="del_equip(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="display_equip" :before-close="handleClose">
      <div>
        <div class="equip_form">
          <el-form label-width="120px" class="demo-ruleForm">
            <el-form-item label="设备名">
              <el-input v-model="equip_name" placeholder="自定义"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="display_equip = false">取 消</el-button>
        <el-button type="primary" @click="pre_equip">确 定</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: '',
      username: window.sessionStorage.getItem('username'),
      password: window.sessionStorage.getItem('password'),
      listGreen: {},
      listEquip: [],
      listGreen_one: [],
      equip_name: '',
      warm_name: '',
      devEui: '',
      display_equip: false,
      display_warm: false
    }
  },
  methods: {
    // 打开弹窗， 初始化温室
    chg_warm (row) {
      this.display_warm = true
      this.warm_name = row.greenHouseName
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
          this.myGreenList()
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
    // 温室中的设备
    getEquip () {
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('greenHouseId', this.activeName)
      this.axios.post(this.$store.state.ip + 'device/greenHouseDevice', formdata).then(res => {
        let test = res.data
        for (let i in test) {
          this.listEquip.push(test[i])
        }
        for (let i = 0; i < this.listEquip.length; i++) {
          this.listEquip[i].num = i + 1
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开弹窗 ，初始化设备
    chg_equip (row) {
      this.display_equip = true
      this.equip_name = row.devName
      this.devEui = row.devEUI
    },
    // 删除设备
    del_equip (row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formdata = new FormData()
        formdata.append('userName', this.username)
        formdata.append('password', this.password)
        formdata.append('devEUI', row.devEUI)
        this.axios.post(this.$store.state.ip + 'device/remove', formdata).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.listEquip = []
          this.getEquip()
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
    // 更改设备名
    pre_equip () {
      this.display_equip = false
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('devEUI', this.devEui)
      formdata.append('devName', this.equip_name)
      this.axios.post(this.$store.state.ip + 'device/modifyName', formdata).then(res => {
        if (res.data === 1) {
          this.$message.success('修改成功')
          this.listEquip = []
          this.getEquip()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 更改 温室名
    pre_warm () {
      this.display_warm = false
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('greenHouseId', this.activeName)
      formdata.append('greenHouseName', this.warm_name)
      this.axios.post(this.$store.state.ip + 'gh/modifyName', formdata).then(res => {
        if (res.data === 1) {
          this.$message.success('修改成功')
          this.myGreenList()
          this.listGreen_one[0].greenHouseName = this.warm_name
        }
      }).catch(err => {
        console.log(err)
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
    console.log(sessionStorage.getItem('activeName'))
    this.activeName = sessionStorage.getItem('activeName')
  },
  watch: {
    'activeName': function () {
      this.listGreen_one = []
      for (let i = 0; i < this.listGreen.length; i++) {
        if (this.listGreen[i].greenHouseId === this.activeName) {
          this.listGreen_one.push(this.listGreen[i])
        }
      }
      this.listEquip = []
      this.getEquip()
    }
  }
}
</script>

<style scoped>
  .equip_height {
    margin-bottom: 10px;
    margin-left: 30px;
    padding-left: 10px;
  }
  .warm_name {
    margin-left: 20px;
    color: #333;
    font-size: 16px;
    text-align: left;
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
  .margin_top_table {
    margin-top: 20px;
  }
  .equip_form {
    width: 450px;
    margin-left: 20px;
    margin-top: 30px;
  }
</style>

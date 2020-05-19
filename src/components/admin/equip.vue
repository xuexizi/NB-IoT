<template>
  <div class="margin_top_table">
    <div class="equip_height">
      <span class="warm_name">设备列表</span>
      <i class="el-icon-circle-plus-outline" style="margin: 5px;cursor: pointer" title="添加设备" @click="addEquip"></i>
    </div>
    <el-table
      :data="listEquip"
      border
      style="width: 1100px; margin-left: 20px;">
      <el-table-column
        prop="num"
        label="序号"
        width="130px">
      </el-table-column>
      <el-table-column
        prop="devName"
        label="设备名称"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="devEUI"
        label="终端串号"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="devType"
        label="设备类型"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="greenHouseName"
        label="温室"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="owner"
        label="设备拥有者"
        width="150px">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150px">
        <template slot-scope="scope" >
          <el-button type="text" size="small" class="cell_chg_cel cell_chg" @click="chg_equip(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="sensor_del cell_chg_cel cell_del"  @click="del_equip(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="display_equip" :before-close="handleClose">
      <div>
        <div class="equip_form">
          <el-form label-width="120px" class="demo-ruleForm">
            <el-form-item label="设备拥有者">
              <el-select v-model="equip_user" placeholder="请选择用户" >
                <div v-for="(user,index) in listUsers" :key="index">
                  <el-option :label="user" :value="user"></el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="display_equip = false">取 消</el-button>
        <el-button type="primary" @click="pre_equip">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="display_equip_add" :before-close="handleClose">
      <div>
        <div class="equip_form">
          <el-form label-width="120px" ref="form" :model="form" class="demo-ruleForm">
            <el-form-item label="设备名称">
              <el-input v-model="form.devName" placeholder="自定义"></el-input>
            </el-form-item>
            <el-form-item label="终端串号">
              <el-input v-model="form.devEUI" placeholder="填写设备上的串号"></el-input>
            </el-form-item>
            <el-form-item label="设备类型">
              <el-input v-model="form.devType" placeholder="填写设备上的类型"></el-input>
            </el-form-item>
            <el-form-item label="设备拥有者">
              <el-select v-model="form.owner" placeholder="请选择用户" >
                <div v-for="(user,index) in listUsers" :key="index">
                  <el-option :label="user" :value="user"></el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="display_equip_add = false">取 消</el-button>
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
      listEquip: [],
      equip_name: '',
      devEui: '',
      display_equip: false,
      display_equip_add: false,
      form: {
        devEUI: '',
        devName: '',
        devType: '',
        owner: ''
      },
      listUsers: [],
      equip_user: ''
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
        }
        console.log(this.listGreen)
      }).catch(err => {
        console.log(err)
      })
    },
    // 设备列表
    getEquip () {
      this.GreenList()
      this.listEquip = []
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      this.axios.post(this.$store.state.ip + 'device/allDevice', formdata).then(res => {
        let test = res.data
        for (let i in test) {
          this.listEquip.push(test[i])
        }
        for (let i = 0; i < this.listEquip.length; i++) {
          this.listEquip[i].num = i + 1
          for (let j = 0; j < this.listGreen.length; j++) {
            if (this.listEquip[i].greenHouseId === this.listGreen[j].greenHouseId) {
              this.listEquip[i].greenHouseName = this.listGreen[j].greenHouseName
              break
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开弹窗 ，初始化设备
    chg_equip (row) {
      this.display_equip = true
      this.devEui = row.devEUI
      this.equip_user = row.owner
      this.getUsers()
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
        this.axios.post(this.$store.state.ip + 'device/deleteDevice', formdata).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
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
    // 修改设备拥有者
    pre_equip () {
      this.display_equip = false
      this.getUsers()
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('devEUI', this.devEui)
      formdata.append('owner', this.equip_user)
      this.axios.post(this.$store.state.ip + 'device/modifyOwner', formdata).then(res => {
        if (res.data === 1) {
          this.$message.success('修改成功')
          this.getEquip()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // addEquip
    addEquip () {
      this.display_equip_add = true
      this.getUsers()
    },
    // 获取 所有用户
    getUsers () {
      this.listUsers = []
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      this.axios.post(this.$store.state.ip + 'user/allUsers', formdata).then(res => {
        this.listUsers = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加设备
    onSubmit () {
      this.display_equip_add = false
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('devEUI', this.form.devEUI)
      formdata.append('devName', this.form.devName)
      formdata.append('devType', this.form.devType)
      formdata.append('owner', this.form.owner)
      this.axios.post(this.$store.state.ip + 'device/addDevice', formdata).then(res => {
        if (res.data === 1) {
          this.$message.success('添加成功')
          this.getEquip()
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
    this.getEquip()
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
  .el-input, .el-select {
    margin-left: 10px;
    width: 350px;
  }
</style>

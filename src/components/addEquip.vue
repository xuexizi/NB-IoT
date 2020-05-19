<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="添加设备" name="first">
        <div class="addWarm_form">
          <el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
            <el-form-item label="*温室选择">
              <el-select v-model="form.warm_name" placeholder="请选择温室" >
                <div v-for="(green,index) in listGreen" :key="index">
                  <el-option :label="green.greenHouseName" :value="green.greenHouseId"></el-option>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item label="*设备编号">
              <el-select v-model="form.equip_name" placeholder="请选择设备编号" >
                <div v-for="(equip,index) in listEquip" :key="index">
                  <el-option :label="equip.devEUI" :value="equip.devEUI"></el-option>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item label="*设备类型">
              <el-input v-model="form.dev_type"></el-input>
            </el-form-item>
            <el-form-item label="*设备名称">
              <el-input v-model="form.dev_name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定增加</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      form: {
        warm_name: '',
        equip_name: '',
        dev_name: '',
        dev_type: ''
      },
      username: window.sessionStorage.getItem('username'),
      password: window.sessionStorage.getItem('password'),
      listGreen: {},
      listEquip: {}
    }
  },
  methods: {
    onSubmit () {
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('devEUI', this.form.equip_name)
      formdata.append('greenHouseId', this.form.warm_name)
      this.axios.post(this.$store.state.ip + 'device/addToGreenHouse', formdata).then(res => {
        if (res.data === 1) {
          this.$message.success('添加成功')
          this.form = {}
        }
      }).catch(err => {
        console.log(err)
        this.$message.success('添加失败')
      })
    },
    cancel () {
      this.form = {}
    }
  },
  created () {
    let formdata = new FormData()
    formdata.append('userName', this.username)
    formdata.append('password', this.password)
    this.axios.post(this.$store.state.ip + 'gh/myGreenHouse', formdata).then(res => {
      this.listGreen = res.data
      for (let i = 0; i < this.listGreen.length; i++) {
        this.listGreen[i].greenHouseId = this.listGreen[i].greenHouseId.toString()
      }
    }).catch(err => {
      console.log(err)
    })
    let formdata1 = new FormData()
    formdata1.append('userName', this.username)
    formdata1.append('password', this.password)
    this.axios.post(this.$store.state.ip + 'device/addibleDevice', formdata1).then(res => {
      this.listEquip = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  watch: {
    'form.equip_name': function () {
      for (let i = 0; i < this.listEquip.length; i++) {
        if (this.form.equip_name === this.listEquip[i].devEUI) {
          this.form.dev_name = this.listEquip[i].devName
          this.form.dev_type = this.listEquip[i].devType
        }
      }
    }
  }
}
</script>

<style scoped>
  .addWarm_form {
    width: 450px;
    margin-left: 20px;
    margin-top: 30px;
  }
  .el-input, .el-select {
    margin-left: 10px;
    width: 350px;
    text-align: left;
  }
</style>

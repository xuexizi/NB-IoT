<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="添加温室" name="first">
        <div class="addWarm_form">
          <el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
            <el-form-item label="*温室名称">
              <el-input v-model="form.warm_name" placeholder="自定义"></el-input>
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
        warm_name: ''
      },
      username: window.sessionStorage.getItem('username'),
      password: window.sessionStorage.getItem('password')
    }
  },
  methods: {
    onSubmit () {
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('greenHouseName', this.form.warm_name)
      this.axios.post(this.$store.state.ip + 'gh/add', formdata).then(res => {
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
  }
</style>

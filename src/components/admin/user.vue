<template>
  <div class="margin_top_table">
    <div class="equip_height">
      <span class="warm_name">用户列表</span>
    </div>
    <el-table
      :data="listUsers"
      border
      style="width: 401px; margin-left: 20px;">
      <el-table-column
        prop="num"
        label="序 号"
        width="200px">
      </el-table-column>
      <el-table-column
        prop="user"
        label="用 户"
        width="200px">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: window.sessionStorage.getItem('username'),
      password: window.sessionStorage.getItem('password'),
      listUsers: []
    }
  },
  methods: {
    // 获取 所有用户
    getUsers () {
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      this.axios.post(this.$store.state.ip + 'user/allUsers', formdata).then(res => {
        let test = res.data
        for (let i = 0; i < test.length; i++) {
          this.listUsers.push({'num': i + 1, 'user': test[i]})
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getUsers()
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
</style>

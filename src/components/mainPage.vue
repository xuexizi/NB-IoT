<template>
 <div class="bg">
   <el-container>
     <el-header>
       <div class="el-header-word">
         <span>NBIOT的蔬菜温室环境监控系统</span>
       </div>
       <div class="el-header-exit">
         <div class="demo-basic--circle el-header-header">
           <div class="el-header-title">
             <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
               <router-link index="1" to="/realTime" tag="li" class="el-menu-item" v-if="username !== 'admin'">实时数据</router-link>
<!--               <el-submenu index="2" v-if="username !== 'admin'">-->
<!--                 <template slot="title">历史数据</template>-->
<!--                 <router-link-->
<!--                   v-for="(warm,index) in listGreen"-->
<!--                   :key="index"-->
<!--                   :index="2+'-'+(index+1)"-->
<!--                   :to="'/hisTime/'+warm.greenHouseId"-->
<!--                   tag="li"-->
<!--                   class="el-menu-item">-->
<!--                   {{warm.greenHouseName}}-->
<!--                 </router-link>-->
<!--               </el-submenu>-->
               <router-link v-if="username !== 'admin'" index="3" :to="'/hisTime/'+greenHouseId" tag="li" class="el-menu-item">历史数据</router-link>
               <router-link v-if="username !== 'admin'" index="3" to="/equipment" tag="li" class="el-menu-item">我的温室</router-link>
               <router-link v-if="username === 'admin'" index="8" to="/user" tag="li" class="el-menu-item">用户列表</router-link>
               <router-link v-if="username === 'admin'" index="6" to="/warm" tag="li" class="el-menu-item">温室列表</router-link>
               <router-link v-if="username === 'admin'" index="7" to="/equip" tag="li" class="el-menu-item">设备列表</router-link>
               <el-submenu index="4" v-if="username !== 'admin'">
                 <template slot="title">设置</template>
                 <router-link index="4-1" to="/addWarm" tag="li" class="el-menu-item">添加温室</router-link>
                 <router-link index="4-1" to="/addEquip" tag="li" class="el-menu-item">添加设备</router-link>
               </el-submenu>
               <el-menu-item index="5" @click="exit" class="exit_point">返回</el-menu-item>
             </el-menu>
           </div>
           <div class="block">
             <el-avatar :size="40" :src="circleUrl"></el-avatar>
           </div>
           <div><span>&nbsp;&nbsp;{{username}}</span></div>
         </div>
       </div>
     </el-header>
     <el-container>
       <el-main>
         <router-view></router-view>
       </el-main>
     </el-container>
   </el-container>
 </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '3',
      circleUrl: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1584677876&di=f799c0e9ee365b544ce10664ef2a139d&src=http://hbimg.b0.upaiyun.com/655ba5b31bc6243428a306b10a7f895b36d3d3d35a1e-5phgk4_fw658',
      password: window.sessionStorage.getItem('password'),
      username: window.sessionStorage.getItem('username'),
      greenHouseId: null
    }
  },
  methods: {
    exit () {
      // window.sessionStorage.setItem('username', '')
      this.$router.push('/greenhouse')
    }
  },
  created () {
    // let formdata = new FormData()
    // formdata.append('userName', this.username)
    // formdata.append('password', this.password)
    this.greenHouseId = sessionStorage.getItem('activeName')
    // this.axios.post(this.$store.state.ip + 'gh/myGreenHouse', formdata).then(res => {
    //   let activeList = sessionStorage.getItem('activeName')
    //   for (let i = 0; i < res.data.length; i++) {
    //     if ('' + res.data[i].greenHouseId === activeList) {
    //       this.listGreen.push(res.data[i])
    //       break
    //     }
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
  }
}
</script>

<style scoped>
  .el-header{
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    background-color: white;
    border: 1px solid transparent;
    margin-left: 20px;
    margin-right: 20px;
  }
  .el-main {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    background-color: #ffffff;
    color: #333;
    text-align: center;
    min-height: 495px;
    overflow-y: scroll;
  }
  .el-main::-webkit-scrollbar {
    display: none;
  }
  .el-header-word {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    letter-spacing: 2px;
    margin-left: 20px;
  }
  .el-header-exit {
    font-size: 14px;
    color: #606266;
    display: flex;
    align-items: center;
  }
  .el-header-header {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .exit_point {
    cursor: pointer;
  }
  .el-header-title {
    margin-right: 30px;
    background-color: #F2F6FC;
  }
</style>

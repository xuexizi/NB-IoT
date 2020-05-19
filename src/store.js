import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 定义状态
  state: {
    ip: 'http://47.102.152.12:8080/'
    // ip: 'http://47.102.152.12:8084/'
  }
})

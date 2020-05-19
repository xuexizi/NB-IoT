<template>
  <div>
    <div v-for="(value,index) in listValue" :key="index" class="realTime">
      <el-form ref="listValue" label-width="90px">
<!--        <el-form-item label="所在温室">-->
<!--          <el-input v-model="value.greenHouseName" readonly></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="传感器名称">
          <el-input v-model="value.devName" readonly></el-input>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="value.value" readonly></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      websock: null,
      lockReconnect: false,
      Url: 'ws://47.102.152.12:8080/realTimeData',
      timeout: 3000,
      timeoutObj: null,
      serverTimeoutObj: null,
      username: window.sessionStorage.getItem('username'),
      password: window.sessionStorage.getItem('password'),
      greenHouseId: window.sessionStorage.getItem('greenHouseId'),
      test: '',
      listValue: []
    }
  },
  methods: {
    // 初始化websocket
    createWebSocket () {
      try {
        this.websock = new WebSocket(this.Url)
        this.init()
      } catch (e) {
        console.log('catch')
        this.reconnect() // 重连函数
      }
    },
    init () {
      this.websock.onopen = () => {
        console.log('连接成功')
        this.heartCheck()
      }
      this.websock.onmessage = (res) => {
        let flag = 1
        for (let i = 0; i < this.listValue.length; i++) {
          if (res.data.devEUI === this.listValue[i].devEUI && res.data.type === this.listValue[i].type && res.data.devType === this.listValue[i].devType) {
            this.listValue[i].value = res.data.value
            flag = 0
            break
          }
        }
        if (flag === 1) {
          this.listValue.push(JSON.parse(res.data))
        }
        this.heartCheck()
      }
      this.websock.onclose = () => {
        console.log('连接断开')
        this.websock.close()
      }
      this.websock.onerror = () => {
        console.log('连接异常')
        this.reconnect()
      }
    },
    reconnect () {
      if (this.lockReconnect) {
        return
      }
      console.log('reconnect')
      this.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      let tt
      tt && clearTimeout(tt)
      tt = setTimeout(function () {
        this.createWebSocket()
        this.lockReconnect = false
      }, 4000)
    },
    // 心跳机制
    heartCheck () { // 3s,每隔timeout时间向服务器发送一个ping
      let obj = {
        'userName': this.username,
        'password': this.password
      }
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(() => {
        // 这里发送一个心跳，后端接收到后，返回一个心跳信息
        this.websock.send(JSON.stringify(obj))
      }, this.timeout)
    }
  },
  mounted () {
    // this.createWebSocket()
    let formdata = new FormData()
    formdata.append('devType', '空气温湿度传感器')
    formdata.append('greenHouseId', '1')
    formdata.append('greenHouseName', 'my green house')
    formdata.append('type', '空气温度（℃）')
    formdata.append('devName', 'seeed-air-th0030')
    formdata.append('value', '18')
    formdata.append('devEUI', '2cf7f12212100030')
    this.axios.post(this.$store.state.ip + 'device/send', formdata).then(res1 => {
      console.log(res1)
    }).catch(err => {
      console.log(err)
    })
    let formdata1 = new FormData()
    formdata1.append('devType', '空气温湿度传感器')
    formdata1.append('greenHouseId', '1')
    formdata1.append('greenHouseName', 'my green house')
    formdata1.append('type', '空气湿度（%RH）')
    formdata1.append('devName', 'seeed-air-th0030')
    formdata1.append('value', '5')
    formdata1.append('devEUI', '2cf7f12212100030')
    this.axios.post(this.$store.state.ip + 'device/send', formdata1).then(res1 => {
      console.log(res1)
    }).catch(err => {
      console.log(err)
    })
    this.test = new Promise(this.createWebSocket)
  }
}
</script>

<style scoped>
.realTime {
  border: 1px solid #ccc;
  text-align: left;
  width: 270px;
  padding-top: 20px;
  margin: 10px 10px 10px 10px;
  display: inline-block;
  float: left;
}
.el-input {
  width: 170px;
  text-align: left;
  border: 0px solid #ccc;
}
</style>

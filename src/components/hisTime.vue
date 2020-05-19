<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(list,index) in listEquip"
        :key="index"
        :label="list.devName"
        :name="list.num">
        <div class="query_history_time">
          时间选择：
          <el-date-picker
            v-model="his_time"
            type="datetimerange"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']">
          </el-date-picker>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="hisQurey" ref="hisQurey" :style="{width: '1130px', height:'470px'}"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: '0',
      tabPosition: 'left',
      greenHouseId: this.$route.params.greenHouseId,
      username: window.sessionStorage.getItem('username'),
      password: window.sessionStorage.getItem('password'),
      listEquip: {},
      equipName: {},
      devEUI: '',
      his_data: [],
      his_data_x: [],
      his_data_y: [],
      his_time: ['2019-12-26 10:00:00', '2020-01-03 12:00:00'],
      test: ''
    }
  },
  methods: {
    // 温室中的设备
    getEquip () {
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('greenHouseId', this.greenHouseId)
      this.axios.post(this.$store.state.ip + 'device/greenHouseDevice', formdata).then(res => {
        this.listEquip = res.data
        for (let i = 0; i < this.listEquip.length; i++) {
          this.listEquip[i].num = i.toString()
        }
        this.devEUI = this.listEquip[0].devEUI
        this.drawLine()
      }).catch(err => {
        console.log(err)
      })
    },
    // 历史数据
    drawLine () {
      this.his_data_x = []
      this.his_data_y = []
      this.his_data = []
      this.equipName = {}
      let formdata = new FormData()
      formdata.append('userName', this.username)
      formdata.append('password', this.password)
      formdata.append('devEUI', this.devEUI)
      formdata.append('startTime', this.his_time[0])
      formdata.append('endTime', this.his_time[1])
      this.axios.post(this.$store.state.ip + 'device/historyData', formdata).then(res => {
        let test = res.data
        let t = 0
        for (let i in test) {
          this.equipName[t++] = i
          this.his_data.push(test[i])
        }
        for (let i = 0; i < this.his_data.length; i++) {
          this.his_data_x[i] = this.his_data[i].time
          this.his_data_y[i] = this.his_data[i].value
        }
        if (this.his_data.length !== 0) {
          for (let i = 0; i < this.his_data_x[0].length; i++) {
            this.his_data_x[0][i] = this.his_data_x[0][i].split(/\./)[0].replace(/T/g, ' ')
          }
        }
        // 打印 历史数据
        let mycharts = this.$echarts.init(this.$refs.hisQurey)
        mycharts.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          color: ['#047edf', '#07cdae', '#9a55ff'],
          legend: {
            align: 'left',
            left: 0,
            data: [this.equipName[0], this.equipName[1], this.equipName[2]]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 100
            }
          ],
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.his_data_x[0]
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: this.equipName[0],
              type: 'line',
              data: this.his_data_y[0],
              lineStyle: {
                normal: {
                  color: '#047edf',
                  width: 3
                }
              }
            },
            {
              name: this.equipName[1],
              type: 'line',
              data: this.his_data_y[1],
              lineStyle: {
                normal: {
                  color: '#07cdae',
                  width: 3
                }
              }
            },
            {
              name: this.equipName[2],
              type: 'line',
              data: this.his_data_y[2],
              lineStyle: {
                normal: {
                  color: '#9a55ff',
                  width: 3
                }
              }
            }
          ]
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getEquip()
  },
  watch: {
    $route (to, from) {
      this.$router.go(0)
    },
    'activeName': function () {
      for (let i = 0; i < this.listEquip.length; i++) {
        if (this.activeName === this.listEquip[i].num) {
          this.devEUI = this.listEquip[i].devEUI
        }
      }
      this.test = new Promise(this.drawLine)
    }
  }
}
</script>

<style scoped>
  .query_history_time {
    padding-top: 10px;
    text-align: right;
    margin-right: 50px;
  }
  .hisQurey{
    margin: 0 auto;
    margin-top: -30px;
    padding-bottom: 15px;
    margin-left: 25px;
  }
</style>

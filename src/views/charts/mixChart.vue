<template>
  <div class='chart-container'>
    <chart title="月度注册用户数统计" height='100%' width='100%' 
      :srcData='srcData' :isIntervalFocus='isIntervalFocus'></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/mix'

export default {
  name: 'mixChart',
  components: { Chart },
  data(){
    return {
      srcData: {'legend': '', 'xData': '', 'yAxisUnit': '', 'series': ''},
      isIntervalFocus: true
    }
  },
  mounted() {
    this.generateData()
  },
  methods: {
    generateData() {
      let legend = ['男性', '女性', '总数']
      let xData = this.getXData()
      let data1 = [709, 1917, 2455, 2610, 1719, 1433, 1544, 3285, 5208, 3372, 2484, 4078]
      let data2 = [327, 1776, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
      let data3 = [1036, 3693, 2962, 3810, 2519, 1915, 1748, 4675, 6209, 4323, 2865, 4298]
      let series = [data1, data2, data3]
      let yAxisUnit = '位'
      this.srcData = {'legend': legend, 'xData': xData, 'yAxisUnit': yAxisUnit, 'series' : series}
    },
    getXData() {
      let data = []
      for (let i = 1; i < 13; i++) {
        data.push(i + '月')
      }
      return data
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  padding: 20px;
  width: 100%;
  height:85vh;
}
</style>


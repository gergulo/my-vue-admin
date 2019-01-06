<template>
  <div class='chart-container'>
    <chart title="接单趋势" height='100%' width='100%' 
      :srcData='srcData' :isIntervalFocus='isIntervalFocus'></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/line'

export default {
  name: 'lineChart',
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
      let legend = ['班车', '出租车']
      let xData = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
      let data1 = [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
      let data2 = [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
      let series = [data1, data2]
      let yAxisUnit = '单'
      this.srcData = {'legend': legend, 'xData': xData, 'yAxisUnit': yAxisUnit, 'series' : series}
    },
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  padding:20px;
  width: 100%;
  height:85vh;
}
</style>


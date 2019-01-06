<template>
  <div class='chart-container'>
    <chart title="键盘图" height='100%' width='100%' 
      :srcData='srcData'></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/keyboard'

export default {
  name: 'keyboardChart',
  components: { Chart },
  data(){
    return {
      srcData: {'xData': '', 'series': ''},
    }
  },
  mounted() {
    this.generateData()
  },
  methods: {
    generateData() {
      let xData = []
      let data1 = []
      let data2 = []
      for (let i = 0; i < 50; i++) {
        xData.push(i)
        data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
        data2.push((Math.sin(i / 5) * (i / 5 + 10) + i / 6) * 3)
      }
      let series = [data1, data2]
      this.srcData = {'xData': xData, 'series' : series}
    },
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
</style>


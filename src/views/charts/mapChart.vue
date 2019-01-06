<template>
  <div class='chart-container'>
    <chart title="物流线路图" height='100%' width='100%' 
      :srcData='srcData' :isIntervalFocus='isIntervalFocus' :interval=5000></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/map'
import mapData from './mapData'

export default {
  name: 'mapChart',
  components: { Chart },
  data(){
    return {
      srcData: { 'legendData' : '', 'seriesData' : ''},
      isIntervalFocus: true
    }
  },
  mounted() {
    this.generateData()
  },
  methods: {
    generateData() {
      let legendData =  mapData.getArea()
      let seriesData = mapData.generateSeries()
      this.srcData = { 'legendData' : legendData, 'seriesData' : seriesData}
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


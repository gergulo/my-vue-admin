<template>
  <div class='chart-container'>
    <chart title="各县班车线路数占比" height='100%' width='100%' 
      :srcData='srcData' :isIntervalFocus='isIntervalFocus'></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/pie'

export default {
  name: 'pieChart',
  components: { Chart },
  data(){
    return {
      srcData: {'series' : ''},
      isIntervalFocus: true
    }
  },
  mounted() {
    this.generateData()
  },
  methods: {
    generateData() {
      fetch('static/data/qiandongnan_data.json').then(res => res.json()).then(res => {
        this.srcData = {'series' : res}
      });
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


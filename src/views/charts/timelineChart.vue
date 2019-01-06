<template>
  <div class='chart-container'>
    <chart title="一周各县市班车乘用情况" height='100%' width='100%' 
      :srcData='srcData'></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/timeline'

export default {
  name: 'timelineChart',
  components: { Chart },
  data(){
    return {
      srcData: { 'area' : '', 'timeline' : '', 'series' : ''},
    }
  },
  mounted() {
    this.generateData()
  },
  methods: {
    generateData() {
      let timeline = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      let area =  ['从江县', '镇远县', '天柱县', '锦屏县', '剑河县', '台江县', '黎平县', '榕江县', '雷山县', '麻江县', '丹寨县', '凯里市', '黄平县', '施秉县', '岑巩县', '三穗县']
      fetch('static/data/qiandongnan_data2.json').then(res => res.json()).then(res => {
        this.srcData =  {'area' : area, 'timeline' : timeline, 'series' : res}
      });
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


<template>
  <div class='panel-container'>
    <div class='chart-container left small'>
      <pieChart id="pieChart" title="县市班车线路数占比" height='100%' width='100%' 
        :srcData='srcData1' :isIntervalFocus='isIntervalFocus'></pieChart>
    </div>
    <div class='chart-container right small'>
      <mixChart id="mixChart" title="月度注册用户数统计" height='100%' width='100%' 
        :srcData='srcData2' :isIntervalFocus='isIntervalFocus' :showDataZoom="showDataZoom"></mixChart>
    </div>
    <div class='chart-container left small'>
      <timelineChart id="timelineChart" title="县市班车乘用情况" height='100%' width='100%' 
        :srcData='srcData3'></timelineChart>
    </div>
    <div class='chart-container right small'>
      <lineChart id="lineChart" title="接单趋势" height='100%' width='100%' 
        :srcData='srcData4' :isIntervalFocus='isIntervalFocus' :showDataZoom="showDataZoom"></lineChart>
    </div>
  </div>
</template>

<script>
  import lineChart from '@/components/Charts/line'
  import mixChart from '@/components/Charts/mix'
  import timelineChart from '@/components/Charts/timeline'
  import pieChart from '@/components/Charts/pie'
  import axios from 'axios'

  export default {
  name: 'bchart',
  components: { lineChart, mixChart, timelineChart, pieChart},
  data(){
    return {
      srcData1: {'series' : ''},
      srcData2: {'legend': '', 'xData': '', 'yAxisUnit': '', 'series': ''},
      srcData3: { 'area' : '', 'timeline' : '', 'series' : ''},
      srcData4: {'legend': '', 'xData': '', 'yAxisUnit': '', 'series': ''},
      isIntervalFocus: true,
      showDataZoom: false,
    }
  },
  mounted() {
    this.generateData1()
    this.generateData2()
    this.generateData3()
    this.generateData4()
  },
  methods: {
    generateData1() {
      fetch('static/data/qiandongnan_data.json').then(res => res.json()).then(res => {
      //axios.get('static/data/qiandongnan_data.json').then((res) => {
        this.srcData1 = {'series' : res}
      });
    },
    generateData2() {
      let legend = ['男性', '女性', '总数']
      let xData = this.getXData()
      let data1 = [709, 1917, 2455, 2610, 1719, 1433, 1544, 3285, 5208, 3372, 2484, 4078]
      let data2 = [327, 1776, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220]
      let data3 = [1036, 3693, 2962, 3810, 2519, 1915, 1748, 4675, 6209, 4323, 2865, 4298]
      let series = [data1, data2, data3]
      let yAxisUnit = '位'
      this.srcData2 = {'legend': legend, 'xData': xData, 'yAxisUnit': yAxisUnit, 'series' : series}
    },
    generateData3() {
      let timeline = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      let area =  ['从江县', '镇远县', '天柱县', '锦屏县', '剑河县', '台江县', '黎平县', '榕江县', '雷山县', '麻江县', '丹寨县', '凯里市', '黄平县', '施秉县', '岑巩县', '三穗县']
      fetch('static/data/qiandongnan_data2.json').then(res => res.json()).then(res => {
      // axios.get('static/data/qiandongnan_data2.json').then((res) => {
        this.srcData3 =  {'area' : area, 'timeline' : timeline, 'series' : res}
      });
    },
    generateData4() {
      let legend = ['班车', '出租车']
      let xData = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
      let data1 = [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
      let data2 = [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
      let series = [data1, data2]
      let yAxisUnit = '单'
      this.srcData4 = {'legend': legend, 'xData': xData, 'yAxisUnit': yAxisUnit, 'series' : series}
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
.panel-container{
  position: relative;
  height: 86vh;
}
.chart-container{
    padding: 10px;
}
.chart-container.large{
  width: 60%;
  height: 100%;
}
.chart-container.small{
  width: 50%;
  height: 50%;
}
.chart-container.left{
  float: left;
}
.chart-container.right{
  float: right;
}
</style>
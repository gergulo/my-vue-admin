<template>
  <div class='chart-container'>
    <chart title="交通拥堵情况图" height='100%' width='100%' 
      :srcData='srcData' @chartInited='setChartInited'></chart>
  </div>
</template>

<script>
import Chart from '@/components/Charts/heatmap'
import axios from 'axios'

export default {
  name: 'heatmapChart',
  components: { Chart },
  data(){
    return {
      srcData: {'center': '', 'series': ''},
      chartInited: false,
    }
  },
  mounted() {
    // 等待页面加载完毕回调
      let timeout = 0;
      let interval = setInterval(() => {
        // 超时10秒加载失败
        if(timeout >= 20) {
          clearInterval(interval);
          console.error("百度地图API初始化失败...");
        }
        // 加载成功
        if(this.chartInited) {
          clearInterval(interval);
          console.log("百度地图API初始化成功，可以加载数据...");
          this.generateData()
        }
        timeout += 1;
      }, 500);
  },
  methods: {
    generateData() {
      let center = [120.13066322374, 30.240018034923]
      axios.get('static/data/hangzhou-tracks.json').then((res) => {
        this.srcData = {'center': center, 'series': res.data}
      });
    },
    setChartInited(status) {
      this.chartInited = status
    }
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


<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import Vue from 'vue';
import echarts from 'echarts'
import bmap from 'echarts/dist/extension/bmap'
import baiduMapAPI from './mixins/baidu-map-api';
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    title: {
      type: String,
      default: 'echart-heatmap'
    },
    srcData: {
      type: Object,
    }
  },
  data() {
    return {
      chartInstance: null, //图表实例
      chartInited: false, //图表是否初始化
    }
  },
  mounted() {
    let vm = this;
    baiduMapAPI.init().then(function(data){
      vm.chartInstance = echarts.init(document.getElementById(vm.id))
      vm.chartInited = true
      vm.$emit("chartInited", true) 
      vm.setData(true)
    });
  },
  beforeDestroy() {
    if (!this.chartInstance) {
      return;
    }
    this.chartInstance.dispose();
    this.chartInstance = null;
  },
  methods: {
    setData(status) {
      if (!this.chartInited)
        return

      if (status){
        this.chartInstance.showLoading()
        return
      }

      let realSeries = [].concat.apply([], this.srcData.series.map(function (track) {
        return track.map(function (seg) {
            return seg.coord.concat([1])
        });
      }));
      
      let option = {
        animation: false,
        bmap: {
            center: this.srcData.center,
            zoom: 13,
            roam: true
        },
        visualMap: {
            show: false,
            top: 'top',
            min: 0,
            max: 5,
            seriesIndex: 0,
            calculable: true,
            inRange: {
                color: ['blue', 'blue', 'green', 'yellow', 'red']
            }
        },
        series: [{
            type: 'heatmap',
            coordinateSystem: 'bmap',
            data: realSeries,
            pointSize: 5,
            blurSize: 6
        }]
      }
      this.chartInstance.setOption(option);

      if (!status)
        this.chartInstance.hideLoading ()
    },
  },
  watch: {
      srcData: {　　　　
        handler(newValue, oldValue) {　　
          this.setData(false)
        },　　　　
        deep: true,
        immediate: true
      }
    }
  }
</script>

<style>
.anchorBL{
  display:none;
}
</style>
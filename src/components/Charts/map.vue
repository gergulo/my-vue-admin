<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
//此处引入中国地图json
//import chinaJson from 'echarts/map/json/china'

import guizhouJson from 'echarts/map/json/province/guizhou'

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
      default: 'pie-chart'
    },
    isIntervalFocus: {  //是否自动定期聚焦
      type: Boolean,
      default: false,
    },
    interval: {   //
      type: Number,
      default: 2000,
    },
    srcData: {
      type: Object,
    }
  },
  data() {
    return {
      chartInstance: null,              //图表实例
      chartInited: false,               //图表是否初始化
      currentIntervalFocusIndex: 0,     //当前自动聚焦图表序列
      isManualFocus: false,             //图表被手动聚焦
      intervalInstance: null,           //定时器实例
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    this.setInterval(false)

    if (!this.chartInstance) 
      return
      
    this.chartInstance.dispose()
    this.chartInstance = null
  },
  methods: {
    initChart() {
      echarts.registerMap('guizhou', guizhouJson);
      this.chartInstance = echarts.init(document.getElementById(this.id))
      this.chartInited = true
      this.bindEvent()
      this.setData(true)
      this.setInterval(true)
    },
    setData(status) {
      if (!this.chartInited)
        return

      if (status){
        this.chartInstance.showLoading()
        return
      }
      
      let option = {
        backgroundColor: '#08263a',
        title: {
          top: 10,
          text: this.title,
          textStyle: {
            fontSize: 14,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip : {
          trigger: 'item'
        },
        legend: {
          x : '70%',
          y : '25%',
          orient: 'vertical',
          left: 'left',
          data: this.srcData.legendData, 
          textStyle: {
              color: '#fff'
          },
          selectedMode: 'single'
        },
        geo: {
          map: 'guizhou',
          zoom: 2,
          center: [107.976380,26.568570],
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#08263A',
              borderColor: '#404a59'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          },
          regions: [{
            name: '黔东南苗族侗族自治州',
            itemStyle: {
              normal: {
                areaColor: '#323c48',
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          }],
        },
        series: this.srcData.seriesData
      }
      this.chartInstance.setOption(option)

      if (!status)
        this.chartInstance.hideLoading ()
    },
    bindEvent() {
      let vm = this;
      this.chartInstance.on('mouseover', function (params) {
        vm.isManualFocus = true
      })
      this.chartInstance.on('mouseout', function (params) {
        vm.isManualFocus = false
      })
    },
    setInterval(status) {
      if (status){  //启动定时器
        if (this.isIntervalFocus)
          this.intervalInstance = setInterval(this.reSetFocusItem, this.interval)
      } else {      //关闭定时器
        if (this.intervalInstance)
          clearInterval(this.intervalInstance)
      }
    },
    reSetFocusItem() {
      if (!this.chartInited)
        return

      if (this.isManualFocus)
        return

      var dataLen = this.srcData.legendData.length;
      this.currentIntervalFocusIndex = (this.currentIntervalFocusIndex + 1) % dataLen;
      // 高亮当前图形
      this.chartInstance.dispatchAction({
          type: 'legendSelect',
          name: this.srcData.legendData[this.currentIntervalFocusIndex]
      });
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
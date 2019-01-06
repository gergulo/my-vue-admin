<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
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
      default: 'pie-chart'
    },
    srcData: {
      type: Object,
    }
  },
  data() {
    return {
      chartInstance: null,              //图表实例
      chartInited: false,               //图表是否初始化
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chartInstance) {
      return
    }
    this.chartInstance.dispose()
    this.chartInstance = null
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(document.getElementById(this.id))
      this.chartInited = true
      this.setData(true)
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
          top: 20,
          text: this.title,
          textStyle: {
            fontSize: 20,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        visualMap: {
          show: false,
          min: 0,
          max: 50,
          dimension: 0,
          inRange: {
            color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
          }
        },
        xAxis: [{
          show: false,
          data: this.srcData.xData
        }, {
          show: false,
          data: this.srcData.xData
        }],
        yAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#4a657a'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#08263f'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [{
          name: 'back',
          type: 'bar',
          data: this.srcData.series[1],
          z: 1,
          itemStyle: {
            normal: {
              opacity: 0.4,
              barBorderRadius: 5,
              shadowBlur: 3,
              shadowColor: '#111'
            }
          }
        }, {
          name: 'Simulate Shadow',
          type: 'line',
          data: this.srcData.series[0],
          z: 2,
          showSymbol: false,
          animationDelay: 0,
          animationEasing: 'linear',
          animationDuration: 1200,
          lineStyle: {
            normal: {
              color: 'transparent'
            }
          },
          areaStyle: {
            normal: {
              color: '#08263a',
              shadowBlur: 50,
              shadowColor: '#000'
            }
          }
        }, {
          name: 'front',
          type: 'bar',
          data: this.srcData.series[0],
          xAxisIndex: 1,
          z: 3,
          itemStyle: {
            normal: {
              barBorderRadius: 5
            }
          }
        }],
        animationEasing: 'elasticOut',
        animationEasingUpdate: 'elasticOut',
        animationDelay(idx) {
          return idx * 20
        },
        animationDelayUpdate(idx) {
          return idx * 20
        }
      }
      this.chartInstance.setOption(option)

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

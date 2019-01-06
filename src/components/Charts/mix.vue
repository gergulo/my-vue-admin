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
    isIntervalFocus: {  //是否自动定期聚焦
      type: Boolean,
      default: false,
    },
    interval: {   //自动定期聚焦间隔
      type: Number,
      default: 2000,
    },
    srcData: {
      type: Object,
    },
    showDataZoom: {     //是否显示DataZoom
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      chartInstance: null,              //图表实例
      chartInited: false,               //图表是否初始化
      currentIntervalFocusIndex: -1,    //当前自动聚焦图表序列
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
        tooltip: {
          trigger: 'axis',
          padding: 5,
          backgroundColor: "#222",
          borderColor: "#777",
          borderWidth: 1,
          textStyle: {
            fontSize: 12,
          },
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '75%',
          top: '5%',
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          selectedMode: false, //禁止点击
          data: this.srcData.legend,
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: this.srcData.xData
        }],
        yAxis: [{
          type: 'value',
          name: '(' + this.srcData.yAxisUnit + ')',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: this.showDataZoom,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 0,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff' 
          },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: this.srcData.legend[0],
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.srcData.series[0]
        },
        {
          name: this.srcData.legend[1],
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.srcData.series[1]
        }, {
          name: this.srcData.legend[2],
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.srcData.series[2]
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
    bindEvent() {
      let vm = this;
      this.chartInstance.on('mouseover', function (params) {
        vm.isManualFocus = true
        //当前自动高亮的扇形不是鼠标指向扇形时，取消之前高亮的图形
        if (params.dataIndex != vm.currentIntervalFocusIndex) {
          vm.chartInstance.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: vm.currentIntervalFocusIndex
          });
        }
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

      var dataLen = this.srcData.xData.length;
      // 取消之前高亮的图形
      this.chartInstance.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.currentIntervalFocusIndex
      });
      this.currentIntervalFocusIndex = (this.currentIntervalFocusIndex + 1) % dataLen;
      // 高亮当前图形
      this.chartInstance.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentIntervalFocusIndex
      });
      // 显示 tooltip
      this.chartInstance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: this.currentIntervalFocusIndex
      });
    }
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

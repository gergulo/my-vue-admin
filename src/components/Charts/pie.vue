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
      default: 'chart-id'
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
        title: {
          top: 10,
          text: this.title,
          textStyle: {
            fontSize: 14,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        backgroundColor: '#08263a',
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
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
          },
          formatter: "{b} : {c} 条 {d}%"
        },
        series: [{
          name: this.title,
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          label: {
            normal: {
              show: true
            }
          },
          hoverOffset: 20,
          startAngle: 90,
          data: this.srcData.series,
          itemStyle: {
            normal: {
              label: {
                show: true,
                textStyle: {  
                  fontSize: 12  
                }, 
                formatter: function(params){ 
                  return params.name+" ：" + params.value + "条\r\n" + params.percent + "%";
                }
              },
              labelLine: {
                show: true
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }],
        legend: {
          x : '70%',
          y : '25%',
          orient: 'vertical',
          left: 'left',
          itemWidth: 12,
          itemHeight: 12, 
          selectedMode: false, //禁止点击
          textStyle: {  
            fontSize: 12 ,
            color:"#999",
          }, 
          formatter: function (name) {
            return name					               
          },
          data: this.srcData.series
        },
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

      var dataLen = this.srcData.series.length;
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

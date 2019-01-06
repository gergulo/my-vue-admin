<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    },
    title: {
      type: String,
      default: "timeline-echart"
    },
    srcData: {
      type: Object
    }
  },
  data() {
    return {
      chartInstance: null, //图表实例
      chartInited: false, //图表是否初始化
    };
  },
  mounted() {
    this.chartInstance = echarts.init(document.getElementById(this.id));
    this.chartInited = true;
    this.setData(true)
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

      let schema = [
        { name: "Area", index: 1, text: "区域名称", unit: "" },
        { name: "Amount", index: 2, text: "总乘坐人数", unit: "" },
        { name: "avga", index: 3, text: "每线路平均人数", unit: "人" },
        { name: "avgb", index: 4, text: "每车平均人数", unit: "人" }
      ];
      let option = {
        baseOption: {
          timeline: {
            axisType: "category",
            orient: "vertical",
            autoPlay: true,
            inverse: true,
            playInterval: 3000,
            left: null,
            right: 0,
            top: 20,
            bottom: 20,
            width: 55,
            height: null,
            label: {
              normal: {
                textStyle: {
                  color: "#999"
                }
              },
              emphasis: {
                textStyle: {
                  color: "#fff"
                }
              }
            },
            symbol: "none",
            lineStyle: {
              color: "#555"
            },
            checkpointStyle: {
              color: "#bbb",
              borderColor: "#777",
              borderWidth: 2
            },
            controlStyle: {
              showNextBtn: false,
              showPrevBtn: false,
              normal: {
                color: "#666",
                borderColor: "#666"
              },
              emphasis: {
                color: "#aaa",
                borderColor: "#aaa"
              }
            },
            data: []
          },
          backgroundColor: "#08263a",
          title: [
            {
              text: this.srcData.timeline[0],
              textAlign: "center",
              left: "90%",
              top: "10%",
              textStyle: {
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.7)"
              }
            },
            {
              top: 10,
              text: this.title,
              textStyle: {
                fontSize: 14,
                color: '#F1F1F3'
              },
              left: '1%'
            }
          ],
          tooltip: {
            padding: 5,
            backgroundColor: "#222",
            borderColor: "#777",
            borderWidth: 1,
            textStyle: {
              fontSize: 12,
            },
            formatter: function(obj) {
              var value = obj.value;
              return (
                schema[0].text + "：" + value[3] + "<br>" +
                schema[1].text + "：" + value[2] + "<br>" +
                schema[2].text + "：" + value[0] + schema[1].unit + "<br>" +
                schema[3].text + "：" + value[1] + schema[0].unit + "<br>"
              );
            }
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: "#fff"
            }
          },
          xAxis: {
            type: "value",
            name: "每线路平均人数",
            max: 300,
            min: 0,
            nameGap: 25,
            nameLocation: "middle",
            nameTextStyle: {
              fontSize: 12
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            axisLabel: {
              formatter: "{value} 人"
            }
          },
          yAxis: {
            type: "value",
            name: "每车平均人数",
            max: 80,
            min: 0,
            nameTextStyle: {
              color: "#ccc",
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            },
            axisLabel: {
              formatter: "{value} 人"
            }
          },
          visualMap: [
            {
              show: false,
              dimension: 3,
              categories: this.srcData.area,
              calculable: true,
              precision: 0.1,
              textGap: 30,
              textStyle: {
                color: "#ccc"
              },
              inRange: {
                color: (function() {
                  var colors = ["#bcd3bb", "#e88f70", "#edc1a5", "#9dc5c8", "#e1e8c8", "#7b7c68", "#e5b5b5", "#f0b489", "#928ea8", "#bda29a" ];
                  return colors.concat(colors);
                })()
              }
            }
          ],
          series: [
            {
              type: "scatter",
              itemStyle: {
                normal: {
                  opacity: 0.8,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              },
              data: this.srcData.series[0],
              symbolSize: function(val) {
                return Math.sqrt(val[2]) + 0.1;
              }
            }
          ],
          animationDurationUpdate: 1000,
          animationEasingUpdate: "quinticInOut"
        },
        options: []
      };
      for (var n = 0; n < this.srcData.timeline.length; n++) {
        option.baseOption.timeline.data.push(this.srcData.timeline[n]);
        option.options.push({
          title: {
            show: true,
            text: this.srcData.timeline[n]
          },
          series: {
            name: this.srcData.timeline[n],
            type: "scatter",
            itemStyle: {
              normal: {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            data: this.srcData.series[n],
            symbolSize: function(val) {
              return Math.sqrt(val[2]) + 0.1;
            }
          }
        });
      }
      this.chartInstance.setOption(option);

      if (!status)
        this.chartInstance.hideLoading ()
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
};
</script>

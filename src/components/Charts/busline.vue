<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts";
import bmap from "echarts/dist/extension/bmap";
import baiduMapAPI from "./mixins/baidu-map-api";
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
      default: "echart-busline"
    },
    srcData: {
      type: Object
    }
  },
  data() {
    return {
      chartInstance: null, //图表实例
      chartInited: false //图表是否初始化
    };
  },
  mounted() {
    let vm = this;
    baiduMapAPI.init().then(function(data) {
      vm.chartInstance = echarts.init(document.getElementById(vm.id));
      vm.chartInited = true;
      vm.$emit("chartInited", true);
      vm.setData(true);
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
      if (!this.chartInited) return;

      if (status) {
        this.chartInstance.showLoading();
        return;
      }

      var hStep = 300 / (this.srcData.series.length - 1);
      let realSeries = [].concat.apply([], this.srcData.series.map(function(busLine, idx) {
          var prevPt;
          var points = [];
          for (var i = 0; i < busLine.length; i += 2) {
            var pt = [busLine[i], busLine[i + 1]];
            if (i > 0) {
              pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]];
            }
            prevPt = pt;
            points.push([pt[0] / 1e4, pt[1] / 1e4]);
          }
          return {
            coords: points,
            lineStyle: {
              normal: {
                color: echarts.color.modifyHSL("#5A94DF", Math.round(hStep * idx))
              }
            }
          };
        })
      );
      let option = {
        bmap: {
          center: this.srcData.center,
          zoom: 10,
          roam: true,
          mapStyle: {
            styleJson: [
              {
                featureType: "water",
                elementType: "all",
                stylers: {
                  color: "#031628"
                }
              },
              {
                featureType: "land",
                elementType: "geometry",
                stylers: {
                  color: "#000102"
                }
              },
              {
                featureType: "highway",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry.fill",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "arterial",
                elementType: "geometry.stroke",
                stylers: {
                  color: "#0b3d51"
                }
              },
              {
                featureType: "local",
                elementType: "geometry",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "railway",
                elementType: "geometry.fill",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "railway",
                elementType: "geometry.stroke",
                stylers: {
                  color: "#08304b"
                }
              },
              {
                featureType: "subway",
                elementType: "geometry",
                stylers: {
                  lightness: -70
                }
              },
              {
                featureType: "building",
                elementType: "geometry.fill",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: {
                  color: "#857f7f"
                }
              },
              {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: {
                  color: "#000000"
                }
              },
              {
                featureType: "building",
                elementType: "geometry",
                stylers: {
                  color: "#022338"
                }
              },
              {
                featureType: "green",
                elementType: "geometry",
                stylers: {
                  color: "#062032"
                }
              },
              {
                featureType: "boundary",
                elementType: "all",
                stylers: {
                  color: "#465b6c"
                }
              },
              {
                featureType: "manmade",
                elementType: "all",
                stylers: {
                  color: "#022338"
                }
              },
              {
                featureType: "label",
                elementType: "all",
                stylers: {
                  visibility: "off"
                }
              }
            ]
          }
        },
        series: [
          {
            type: "lines",
            coordinateSystem: "bmap",
            polyline: true,
            data: realSeries,
            silent: true,
            lineStyle: {
              normal: {
                // color: '#c23531',
                // color: 'rgb(200, 35, 45)',
                opacity: 0.2,
                width: 1
              }
            },
            progressiveThreshold: 500,
            progressive: 200
          },
          {
            type: "lines",
            coordinateSystem: "bmap",
            polyline: true,
            data: realSeries,
            lineStyle: {
              normal: {
                width: 0
              }
            },
            effect: {
              constantSpeed: 20,
              show: true,
              trailLength: 0.1,
              symbolSize: 1.5
            },
            zlevel: 1
          }
        ]
      };
      this.chartInstance.setOption(option);

      if (!status) 
        this.chartInstance.hideLoading();
    }
  },
  watch: {
    srcData: {
      handler(newValue, oldValue) {
        this.setData(false);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style>
.anchorBL{
  display:none;
}
</style>
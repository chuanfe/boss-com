
import $ from 'jquery';
import _ from 'lodash';
import EChart from 'echarts';
import utils from './utils';

class EchartScatter {
  constructor(container, config) {
    this.config = this.fixConfig(config);
    this.container = $(container);
    this.data = null;
    this.chart = null;
    this.init();
  }

  init() {
    this.chart = EChart.init(this.container[0]);
    this.fixData(this.data);
    this.chart.setOption(this.config, true);
  }

  render(data, config) {
    this.fixConfig(config);
    this.fixData(data);
    this.chart.setOption(this.config, true);
  }

  fixConfig(config) {
    config = utils.fixConfigToEchart(config);
    if (!config) {
      return;
    }
    const legendData = [];
    const {
      series
    } = config;
    if (series.length > 0) {
      series.forEach((m) => {
        legendData.push(m.name);
      });
    }
    const {
      global,
      xAxis,
      yAxis,
      ...restconfig
    } = config;
    global.mainColor = _.values(global.mainColor);
    this.config = _.merge(
      {
        legend: {
          bottom: 5,
          data: legendData
        },
        grid: {
          containLabel: true,
          borderWidth: 0
        },
        tooltip: {
          confine: true,
          padding: 8
        },
        series,
        xAxis,
        yAxis
      }, {
        xAxis: {
          axisLine: {
            lineStyle: {
              color: xAxis.axisLine.lineStyleColor
            }
          },
          axisTick: {
            lineStyle: {
              color: xAxis.axisLine.lineStyleColor
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: yAxis.axisLine.lineStyleColor
            }
          },
          axisTick: {
            lineStyle: {
              color: yAxis.axisLine.lineStyleColor
            }
          },
          splitLine: {
            lineStyle: {
              type: yAxis.splitLine.lineStyle.sType
            }
          }
        },
        ...restconfig
      });
    return this.config;
  }

  fixData(data) {
    if (data) {
      this.data = data;
      // 数据转换
    }
    const {
      series
    } = this.config;
    if (series) {
      series.forEach((n) => {
        const dataArr = [];
        if (this.data) {
          this.data.forEach((item) => {
            if (item.s === n.name) {
              const _arr = [item.x, item.y];
              dataArr.push(_arr);
            }
          });
        }
        n.data = dataArr;
        n.type = 'scatter';
      });
    }
  }

  resize(width, height) {
    this.chart.resize({
      width,
      height
    });
  }

  destroy() {
    this.chart.dispose();
  }
}

module.exports = EchartScatter;

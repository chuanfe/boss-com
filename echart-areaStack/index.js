
import $ from 'jquery';
import _ from 'lodash';
import EChart from 'echarts';
import utils from './utils';

class EchartAreaStack {
  constructor(container, config) {
    this.config = this.fixConfig(config);
    this.container = $(container);
    this.data = null;
    this.chart = null;
    this.init();
  }

  init() {
    this.chart = EChart.init(this.container[0]);
    this.chart.setOption(this.config);
  }

  render(data, config) {
    this.fixConfig(config);
    this.fixData(data);
    this.chart.setOption(this.config);
  }

  fixConfig(config) {
    config = utils.fixConfigToEchart(config);
    if (!config) {
      return;
    }
    const {
      global,
      series,
      xAxis,
      yAxis,
      ...restconfig
    } = config;
    global.mainColor = _.values(global.mainColor);
    this.config = _.merge(
      {
        legend: {
          bottom: 5
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
        ...restconfig,
      }
    );
    return this.config;
  }

  fixData(data) {
    if (data) {
      this.data = data;
      // 数据转换
    }
    const {
      series,
      xAxis
    } = this.config;
    if (xAxis) {
      xAxis.type = 'category';
      xAxis.data = _.uniq(_.map(this.data, 'x'));
    }
    if (series) {
      series.forEach(n => {
        n.data = _.map(_.filter(this.data, { 's': n.name }), 'y');
        n.type = "line"
      });
    }
    console.log("-------------------this.config----------------------")
    console.log(this.config);
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

module.exports = EchartAreaStack;


import $ from 'jquery';
import _ from 'lodash';
import EChart from 'echarts';
import utils from './utils';

class EchartCircleBar {
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
      radiusAxis,
      angleAxis,
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
        radiusAxis,
        angleAxis
      }, {
        radiusAxis: {
          axisLine: {
            lineStyle: {
              color: radiusAxis.axisLine.lineStyleColor
            }
          },
          axisTick: {
            lineStyle: {
              color: radiusAxis.axisLine.lineStyleColor
            }
          }
        },
        angleAxis: {
          axisLine: {
            lineStyle: {
              color: angleAxis.axisLine.lineStyleColor
            }
          },
          axisTick: {
            lineStyle: {
              color: angleAxis.axisLine.lineStyleColor
            }
          },
          axisTick: {
            lineStyle: {
              color: angleAxis.axisLine.lineStyleColor
            }
          },
          splitLine: {
            lineStyle: {
              type: angleAxis.splitLine.lineStyle.sType
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
      radiusAxis
    } = this.config;
    if (radiusAxis) {
      radiusAxis.type = 'category';
      radiusAxis.data = _.uniq(_.map(this.data, 'x'));
    }
    if (series) {
      series.forEach(n => {
        n.data = _.map(_.filter(this.data, { 's': n.name }), 'y');
        n.type = "bar";
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

module.exports = EchartCircleBar;

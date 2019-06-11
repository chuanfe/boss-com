
import $ from 'jquery';
import _ from 'lodash';
import EChart from 'echarts';

class EchartPie {
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
    if (!config) {
      return;
    }
    const {
      mainColor,
      series,
      ...restconfig
    } = config;
    const {
      center,
      radius,
      ...restSerie
    } = series[0];

    this.config = _.merge(
      {
        color: _.map(mainColor, m => m.color),
        legend: {
          bottom: 5
        },
        grid: {
          containLabel: true
        },
        tooltip: {
          confine: true,
          padding: 8
        },
        series: []
      },
      {
        series: [
          {
            center: [center.x || '50%', center.y || '50%'],
            radius: [radius.inner || 0, radius.outer || '75%'],
            ...restSerie
          }
        ]
      },
      restconfig
    );
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
      // 有且只有一个系列
      series[0].data = _.map(this.data, n => ({
        name: n.x,
        value: n.y
      }));
    }
    return this.data;
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

module.exports = EchartPie;

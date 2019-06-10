
import $ from 'jquery';
import _ from 'lodash';
import EChart from 'echarts';
import 'echarts-wordcloud';
import utils from './utils';

class EchartWorldcloud {
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
      ...restconfig
    } = config;
    const {
      sizeRange,
      rotationRange,
      ...restSerie
    } = series[0];

    this.config = _.merge(
      {
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
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          width: '100%',
          height: '100%',
          right: null,
          bottom: null,
          rotationStep: 45,
          drawOutOfBound: false,

          data: []
        }]
      },
      {
        series: [
          {
            ...restSerie,
            sizeRange: [sizeRange.min, sizeRange.max],
            rotationRange: [rotationRange.min, rotationRange.max]

          }
        ]
      },
      {
        series: [
          {
            textStyle: {
              normal: {
                color: (global.randomColor) ? function () {
                  return `rgb(${[
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',')})`;
                } : global.textStyle.color
              }
            }
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

module.exports = EchartWorldcloud;

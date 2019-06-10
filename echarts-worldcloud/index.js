
import $ from 'jquery';
import _ from 'lodash';
import EChart from 'echarts';
import 'echarts-wordcloud';

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
    if (!config) {
      return;
    }
    const {
      mainColor,
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
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          // left: 'center',
          // top: 'center',
          width: '100%',
          height: '100%',
          right: null,
          bottom: null,
          rotationStep: 45,
          drawOutOfBound: false,
          textStyle: {
            normal: {
              color() {
                // Random color
                return `rgb(${[
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',')})`;
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: []
        }]
      },
      {
        series: [
          {
            sizeRange: [sizeRange.min, sizeRange.max],
            rotationRange: [rotationRange.min, rotationRange.max],
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

module.exports = EchartWorldcloud;

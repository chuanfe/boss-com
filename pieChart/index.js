var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
var EChart = require('echarts');
var Utils = require('datav:/com/maliang-echarts-utils/0.0.18');

/**
 * 马良基础类
 */
module.exports = Event.extend(
  function Base(container, config) {
    this.config = { series: [] };
    this.container = $(container);           //容器
    this.apis = config.apis;                 //hook一定要有
    this._data = null;                       //数据
    this.chart = null;                       //图表
    this.init(config);
  }, {
    /**                                                                                 
     * 公有初始化
     */
    init: function (config) {
      config = this.mergeConfig(config);
      this.chart = EChart.init(this.container[0]);
      this.chart.setOption(Utils.config2echartsOptions(config));
    },
    /**
     * 绘制
     * @param data
     * @param options 不一定有
     * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
     */
    render: function (data, config) {
      config = this.mergeConfig(config);
      data = this.data(data);
      //var cfg = Utils.config2echartsOptions(this.mergeConfig(Utils.data2echartsAxis(data, config)));
      //数据转换
      var cfg = Object.assign({}, config);
      let seriesData = [], legendData = [];
      data.forEach(function (e) {
        seriesData.push({ name: e.x, value: e.y });
        legendData.push(e.x);
      })
      if (config.series) cfg.series[0].data = seriesData;
      if (config.legend) cfg.legend.data = legendData;
      this.chart.setOption(cfg);
    },
    /**
     *
     * @param width
     * @param height
     */
    resize: function (width, height) {
      this.chart.resize({
        width: width,
        height: height
      })
    },
    /**
     * 数据,设置和获取数据
     * @param data
     * @returns {*|number}
     */
    data: function (data) {
      if (data) {
        this._data = data;
      }
      return this._data;
    },
    /**
     * 更新配置
     * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
     * [注] 有数组的配置一定要替换
     * @param config
     * @private
     */
    mergeConfig: function (config) {
      if (!config) { return this.config }
      if (config.tooltip) {
        config.tooltip.backgroundColor = config.tooltip.backgroundColor.value;
      }
      if (config.legend && config.legend.selectedPostion) {
        config.textStyle
        switch (config.legend.selectedPostion) {
          case "topCenter":
            config.legend.left = "center";
            config.legend.top = "top";
            config.legend.orient="horizontal";
            break;
          case "topLeft":
            config.legend.left = "left";
            config.legend.top = "top";
            config.legend.orient="horizontal";
            break;
          case "topRight":
            config.legend.left = "right";
            config.legend.top = "top";
            config.legend.orient="horizontal";
            break;
          case "bottomCenter":
            config.legend.left = "center";
            config.legend.top = "bottom";
            config.legend.orient="horizontal";
            break;
          case "bottomLeft":
            config.legend.left = "left";
            config.legend.top = "bottom";
            config.legend.orient="horizontal";
            break;
          case "bottomRight":
            config.legend.left = "right";
            config.legend.top = "bottom";
            config.legend.orient="horizontal";
            break;
          case "rightCenter":
            config.legend.left = "right";
            config.legend.top = "middle";
            config.legend.orient="vertical";
            break;
          case "leftCenter":
            config.legend.left = "left";
            config.legend.top = "middle"
            config.legend.orient="vertical";
            break;
          default:
            config.legend.left = "center";
            config.legend.top = "top";
            config.legend.orient="horizontal";
        }
      }
      if (config.series) {
        let color = [];
        config.series.color && config.series.color.forEach((d) => {
          if (d.color) {
            color.push(d.color);
          }
        });
        color = color.concat(['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']);
        config.series = _.defaultsDeep({ center: [config.series.positionLeft, config.series.positionTop] }, { color: color, type: 'pie' }, config.series, config.series[0]);
      }
      this.config = _.defaultsDeep(config || {}, this.config);
      console.log(this.config);
      return this.config;
    },
    /**
     * 更新样式
     * 有些子组件控制不到的,但是需要控制改变的,在这里实现
     */
    updateStyle: function () {
      var cfg = this.config;
    },
    clear: function () {
      this.chart && this.chart.clear && this.chart.clear();
    },
    /**
     * 销毁组件
     */
    destroy: function () {
      this.chart && this.chart.dispose && this.chart.dispose();
    }
  });
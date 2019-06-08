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
    this.config = { series: [], yAxis: { data: [], type: 'category' }, xAxis: { data: [], type: 'value' } };
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
      var cfg = Utils.config2echartsOptions(this.mergeConfig(Utils.data2echartsAxis(data, config)));
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
      if (config.xAxis && config.xAxis.axisLine) {
        config.xAxis.name = config.xAxis.tName;
        config.xAxis.axisLine.lineStyle = {};
        config.xAxis.axisTick = {};
        config.xAxis.axisTick.lineStyle = {};
        config.xAxis.axisLine.lineStyle.color = config.xAxis.axisLine.lineStyleColor;
        config.xAxis.axisTick.lineStyle.color = config.xAxis.axisLine.lineStyleColor;
      }
      if (config.yAxis && config.yAxis.axisLine) {
        config.yAxis.name = config.yAxis.tName;
        config.yAxis.axisLine.lineStyle = {};
        config.yAxis.axisTick = {};
        config.yAxis.axisTick.lineStyle = {};
        config.yAxis.axisLine.lineStyle.color = config.yAxis.axisLine.lineStyleColor;
        config.yAxis.axisTick.lineStyle.color = config.yAxis.axisLine.lineStyleColor;
      }
      if (config.grid) {
        config.grid.borderWidth = 0;
      }
      if (config.legend && config.legend.selectedPostion) {
        config.textStyle
        switch (config.legend.selectedPostion) {
          case "topCenter":
            config.legend.left = "center";
            config.legend.top = "top";
            config.legend.orient = "horizontal";
            break;
          case "topLeft":
            config.legend.left = "left";
            config.legend.top = "top";
            config.legend.orient = "horizontal";
            break;
          case "topRight":
            config.legend.left = "right";
            config.legend.top = "top";
            config.legend.orient = "horizontal";
            break;
          case "bottomCenter":
            config.legend.left = "center";
            config.legend.top = "bottom";
            config.legend.orient = "horizontal";
            break;
          case "bottomLeft":
            config.legend.left = "left";
            config.legend.top = "bottom";
            config.legend.orient = "horizontal";
            break;
          case "bottomRight":
            config.legend.left = "right";
            config.legend.top = "bottom";
            config.legend.orient = "horizontal";
            break;
          case "rightCenter":
            config.legend.left = "right";
            config.legend.top = "middle";
            config.legend.orient = "vertical";
            break;
          case "leftCenter":
            config.legend.left = "left";
            config.legend.top = "middle"
            config.legend.orient = "vertical";
            break;
          default:
            config.legend.left = "center";
            config.legend.top = "top";
            config.legend.orient = "horizontal";
        }
      }
      if (config.series) {
        config.series.forEach((d, i) => {
          if (d.data) {
            this.config.series[i].data = d.data;
          }
          this.config.series[i] = _.defaultsDeep(d || {}, this.config.series[i]);
          this.config.series[i].type = 'bar';
        });
        this.config.series = _.take(this.config.series, config.series.length);
      }
      if (config.yAxis.data) {
        this.config.yAxis.data = config.yAxis.data;
      }
      this.config = _.defaultsDeep(config || {}, this.config);
      this.config.legend.data = _.map(this.config.series, "name");
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
var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //初始化容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    let {value, total} = this.data(data);
    var cfg = this.mergeConfig(config);
    const {
      fineness,
      borderRadius,
      thumbBg,
      trackBg,
      tip: {
        tipColor,
        tipFontSize,
        tipFontWeight
      }
    } = cfg;
    const thumbBgCss = thumbBg.style === 'single' ? thumbBg.value : `linear-gradient(to right, ${thumbBg.from}, ${thumbBg.to})`
    //更新图表
    //this.chart.render(data, cfg);
    const tpl = `
    <div class="progress-bar-warpper" style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    ">
      <div class="progress" style="
          position: relative;
          width: 90%;
          height: ${fineness}px;
          background: ${trackBg};
          border-radius: ${borderRadius}px;
        ">
          <div class="progress-bar" style="
            float: left;
            position: relative;
            width: 0%;
            height: 100%;
            background: ${thumbBgCss};
            border-radius: ${borderRadius}px;
          ">
          <div class="progress-bar-tip" style="
            position: absolute;
            top: -${tipFontSize + 8}px;
            font-size: ${tipFontSize}px;
            right: 0;
            color: ${tipColor};
            transform: translateX(50%);
            font-weight: ${tipFontWeight};
            font-family: "Microsoft Yahei";
          ">0</div>
          <div class="progress-bar-triangle" style="
            position: absolute;
            width: 0;
            height: 0;
            border: ${0.3 * fineness}px solid;
            border-color: transparent transparent ${tipColor};
            top: ${fineness}px;
            right: 0;
          "></div>
        </div>
      </div>
    </div>
    `
    this.container.html(tpl);
    
    this.dynamicEffect();
    //如果有需要的话,更新样式
    // this.updateStyle({width});
  },
  /** 
   * 动效函数
  */
  dynamicEffect: function() {
    let {value, total} = this._data;
    const {
      tip: {
        tipFix,
        showRealValue
      }
    } = this.config;
    const barEl = this.container.find('.progress-bar');
    const textEl = this.container.find('.progress-bar-tip');

    $({property:0}).animate({property:100},
      {
        duration:600,
        step:function(){
          const width = `${this.property/100*(value / total * 100)}%`;
          const text=`${(this.property/100*(showRealValue ? value : value / total * 100)).toFixed(tipFix)}${showRealValue ? '' : '%'}`;
          barEl.css('width', width);
          textEl.text(text);
        }
      }
    )},
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    this.render(this._data, this.config);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
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
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {},
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){
     this.container.empty();
   }
});
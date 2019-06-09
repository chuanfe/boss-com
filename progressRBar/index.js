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
    this.data(data);
    var cfg = this.mergeConfig(config);
    const {
      fineness,
      thumbBg,
      trackBg,
      tip: {
        tipColor,
        tipFontSize,
        tipFontWeight
      }
    } = cfg;
    const wrapWidth = this.container.width();
    const wrapHeight = this.container.height();

    const roundWidth = Math.min(wrapWidth, wrapHeight);
    console.log(roundWidth)
    //更新图表
    //this.chart.render(data, cfg);
    const tpl = `
      <div class="progress-bar-warpper" style="
        margin: 0px auto;
        width: ${roundWidth}px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        <div class="progress-bar-round" style="
          position: relative;
          width: 90%;
          padding-bottom: 90%;
        ">
          <div class="progress-bar-round-tip" style="
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${tipFontSize}px; 
            font-weight: ${tipFontWeight}; 
            color: ${tipColor};
            font-family: Microsoft Yahei; 
          ">
            0
          </div>
          <div class="progress-bar-round-wrapper right" style="
            width: 50%;
            height: 100%;
            position: absolute;
            top: 0;
            overflow: hidden;
            right: 0;
          ">
            <div class="circle right" style="
              width: 200%;
              height: 100%;
              border: ${fineness}px solid transparent;
              border-radius: 50%;
              position: absolute;
              top: 0;
              right: 0;
              transform: rotate(-135deg); 
              border-width: ${fineness}px; 
              border-style: solid; 
              border-color: ${thumbBg} ${thumbBg} ${trackBg} ${trackBg};">
            </div>
          </div>
          <div class="progress-bar-round-wrapper left" style="
            width: 50%;
            height: 100%;
            position: absolute;
            top: 0;
            overflow: hidden;
            left: 0;
          ">
            <div class="circle left" style="
              width: 200%;
              height: 100%;
              border: ${fineness}px solid transparent;
              border-radius: 50%;
              position: absolute;
              top: 0;
              left: 0;
              transform: rotate(-136deg); 
              border-width: ${fineness}px; 
              border-style: solid; 
              border-color: ${trackBg} ${trackBg} ${thumbBg} ${thumbBg};">
            </div>
          </div>
        </div>
      </div>
    `
    this.container.html(tpl);
    this.dynamicEffect()
    //如果有需要的话,更新样式
    // this.updateStyle({width});
  },
  dynamicEffect: function() {
    let {value, total} = this._data;
    const {
      tip: {
        tipFix,
        showRealValue
      }
    } = this.config;
    let degree = value / total * 360;
    const textEl = this.container.find('.progress-bar-round-tip');
    const rightEl = this.container.find('.circle.right');
    const leftEl = this.container.find('.circle.right');
    degree>360 && (degree = 360);
    degree<0 && (degree = 0);

    $({property:0}).animate({property:100},
      {
        duration:600,
        step:function(){
          var deg=this.property/100*degree;
          var text=`${(this.property/100*(showRealValue ? value : value / total * 100)).toFixed(tipFix)}${showRealValue ? '' : '%'}`;
          if (deg<=180) {
            rightEl.css("-webkit-transform",`rotate(${-135 + deg}deg)`);
            textEl.text(text);
          }else{
            deg=deg-180;
            rightEl.css("-webkit-transform",`rotate(45deg)`);
            leftEl.css("-webkit-transform",`rotate(${-135 + deg}deg)`);
            textEl.text(text);
          }              
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
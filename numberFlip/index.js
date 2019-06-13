/*
 * @Author: linyee.lqBai
 * @Date: 2019-06-10 16:00:25
 * @LastEditors: linyee.lqBai
 * @LastEditTime: 2019-06-13 10:11:29
 * @Description:
 */
/* stylelint-disable */
import $ from 'jquery';
import _ from 'lodash';
import './numbersFlip.less';

require('./numbersFlip.js')($);

/**
 * 马良基础类
 */
class NumberFlip {
  constructor(container, config) {
    this.config = {
      theme: {}
    };
    this.container = $(container); // 初始化容器
    this.apis = config.apis; // hook一定要有
    this._data = null; // 数据
    this.chart = null; // 图表
    this.init(config);
  }

  /**
   * 公有初始化
   */
  init(config) {
    this.config = _.merge(this.config, config);
    this.container.html(`
      <div class="number-flip-wrapper">
        <div class="number-flip-flex">
          <div class="flip-number-prefix"></div>
          <div class="flip-inner"></div>
          <div class="flip-number-suffix"></div>
        </div>
      </div>`);
    this.$numberFlip = this.container.find('.flip-inner');
    this.$numberFlipPrefix = this.container.find('.flip-number-prefix');
    this.$numberFlipSuffix = this.container.find('.flip-number-suffix');
  }

  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render(data, config) {
    console.log(config);
    this.data(data);
    this.mergeConfig(config);
  }

  resize() {}

  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data(data) {
    if (data) {
      if (this._data && !_.isEqual(this._data, data)) {
        this.isInit = true;
        this.$numberFlip.resetData(data.value);
      }
      this._data = data;
    }
    return this._data;
  }

  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig(config) {
    if (!config) {
      this.isInit = true;
      this.initNumberFlip();
      return this.config;
    }
    const nextCfg = _.defaultsDeep(config || {}, this.config);
    if (!this.isInit || !_.isEqual(this.config, nextCfg)) {
      this.isInit = true;
      this.config = nextCfg;
      this.initNumberFlip();
    }
    return this.config;
  }

  initNumberFlip() {
    const {
      speed, hasPct, symbol, dot, border
    } = this.config;
    const { value } = this._data;
    this.$numberFlip.numberAnimate({
      num: value || 0,
      pct: hasPct ? '%' : '',
      dot,
      speed,
      symbol: symbol ? ',' : '',
      border
    });
    this.updatePrefix();
    this.updateSuffix();
    this.updateStyle();
  }

  updatePrefix() {
    const {
      prefix: {
        text,
        alignSelf,
        color,
        fontFamily,
        fontSize,
        marginRight,
        show
      }
    } = this.config;
    if (show) {
      this.$numberFlipPrefix.html(text);
      this.$numberFlipPrefix.css({
        alignSelf,
        color,
        fontFamily,
        fontSize,
        marginRight
      });
    }
  }

  updateSuffix() {
    const {
      suffix: {
        text,
        alignSelf,
        color,
        fontFamily,
        fontSize,
        marginLeft,
        show
      }
    } = this.config;
    if (show) {
      this.$numberFlipSuffix.html(text);
      this.$numberFlipSuffix.css({
        alignSelf,
        color,
        fontFamily,
        fontSize,
        marginLeft
      });
    }
  }

  updateLayout() {}

  updateStyle() {
    const {
      style: {
        fontFamily, fontSize, fontColor, fontWeight, fontBg, margin
      }
    } = this.config;
    const $wrapper = this.container.find('.number-flip');
    const $domBg = this.container.find('.number-flip-dom-bg');
    $wrapper.css({
      fontFamily, fontSize, fontWeight, color: fontColor
    });
    $domBg.css({
      background: fontBg,
      margin: `0 ${margin}px`
    });
    // if() {}
  }

  destroy() { this.container.empty(); }
}

module.exports = NumberFlip;

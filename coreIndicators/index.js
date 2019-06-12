import $ from 'jquery';
import _ from 'lodash';
import './index.less';
/**
 * 马良基础类
 */
class CoreIndicator {
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
    // 1.初始化,合并配置
    console.log(config);
    this.mergeConfig(config);
    // 2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    this.defaultTheme = [
      {
        bg: 'rgb(36, 203, 255)',
        fontColor: '#fff',
        indicatorRedFontColor: '#DD4B39',
        indicatorGreenFontColor: '#00A65A'
      },
      {
        bg: 'rgb(119, 96, 246)',
        fontColor: '#fff',
        indicatorRedFontColor: '#DD4B39',
        indicatorGreenFontColor: '#00A65A'
      },
      {
        bg: 'rgb(72, 76, 220)',
        fontColor: '#fff',
        indicatorRedFontColor: '#DD4B39',
        indicatorGreenFontColor: '#00A65A'
      },
      {
        bg: 'rgb(113, 29, 142)',
        fontColor: '#fff',
        indicatorRedFontColor: '#DD4B39',
        indicatorGreenFontColor: '#00A65A'
      }
    ];
    this.tpl = '<div class="core-indicators-wrapper"></div>';
    this.cardTpl = (_config, data) => {
      let rateColor = '';
      switch (data.rate_level) {
        case 'red':
          rateColor = _config.indicatorRedFontColor;
          break;
        case 'green':
          rateColor = _config.indicatorGreenFontColor;
          break;
        default:
          break;
      }

      return `
      <li class="col" style="
        padding-top: ${_config.padding}px;
        padding-left: ${_config.padding}px;
      ">
        <div class="summary-item" style="background-color: ${_config.bg};border-radius: ${_config.borderRadius}px">
          <h4 style="color: ${_config.fontColor}; font-size: ${_config.valueFontSize}px" >
            ${parseFloat(data.value).toLocaleString()}
          </h4>
          <div class="desc" style="
            color: ${rateColor};
          ">
            <span class="desc-name"style=”font-size: ${_config.nameFontSize}px“>
              ${data.name}
            </span>
            ${data.rate ? `
              &nbsp;
              <span class="rate" style="font-size: ${_config.rateFontSize}px">
                <span class="caret ${data.rate > 0 ? 'rise' : ''}"></span>
                &nbsp;${data.rate}%&nbsp;
              </span>
            ` : ''}
          </div>
        </div>
      </li>
    `;
    };
  }
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render(data, config) {
    const _data = this.data(data);
    const cfg = this.mergeConfig(config);
    this.container.html(this.tpl);
    const { cols, useDefaultTheme, customTheme } = cfg;
    const theme = useDefaultTheme ? this.defaultTheme : customTheme;

    const chunkArr = _.chunk(_data, cols || _data.length);
    let cardDomStr = '';
    chunkArr.forEach((chunk, i) => {
      let chunkDomStr = '';
      chunk.forEach((item, j) => {
        const themeIndex = ((i * cols) + j) % theme.length;
        const _cfg = _.merge({}, cfg, theme[themeIndex]);
        chunkDomStr += this.cardTpl(_cfg, item);
      });
      cardDomStr += `
        <div class="core-indocators-row">
          <ul class="hbox">
            ${chunkDomStr}
          </ul>
        </div>
      `;
    });
    this.container.find('.core-indicators-wrapper').append(cardDomStr);
  }

  resize() {}
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data(data) {
    if (data) {
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
    if (!config) { return this.config; }
    const _config = _.cloneDeep(config);
    this.config = _.defaultsDeep(config || {}, this.config);
    this.config.customTheme = _config.customTheme || this.config.customTheme;
    return this.config;
  }
  updateLayout() {}
  updateStyle() {}
  destroy() { this.container.empty(); }
}

module.exports = CoreIndicator;

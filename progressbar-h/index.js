import $ from 'jquery';
import _ from 'lodash';

class ProgressBarH {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {},
      config
    );
    this.data = null;
  }

  render(data, config) {
    if (!data) {
      data = this.data;
    }
    this.data = data;
    this.config = _.merge({}, this.config, config);
    const {
      fineness,
      borderRadius,
      thumbBg,
      trackBg,
      tip: {
        fontFamily: tipFontFamily,
        color: tipColor,
        fontSize: tipFontSize,
        fontWeight: tipFontWeight
      }
    } = this.config;
    const thumbBgCss = thumbBg.style === 'single' ? thumbBg.value : `linear-gradient(to right, ${thumbBg.from}, ${thumbBg.to})`;
    const tpl = `
      <div class="boss-progress-bar h" style="
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
                font-family: ${tipFontFamily};
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
    `;
    this.container.html(tpl);
    this.dynamicEffect();
  }

  dynamicEffect() {
    const { value, total } = this.data[0];
    const {
      tip: {
        fixed,
        isRealValue
      }
    } = this.config;
    const barEl = this.container.find('.progress-bar');
    const textEl = this.container.find('.progress-bar-tip');

    $({ property: 0 }).animate(
      { property: 100 },
      {
        duration: 600,
        step() {
          const width = `${(this.property / 100) * ((value / total) * 100 > 100 ? 100 : (value / total) * 100)}%`;
          const text = `${((this.property / 100) * (isRealValue ? value : (value / total) * 100)).toFixed(fixed)}${isRealValue ? '' : '%'}`;
          barEl.css('width', width);
          textEl.text(text);
        }
      }
    );
  }
}

module.exports = ProgressBarH;

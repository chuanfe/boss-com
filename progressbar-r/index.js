import $ from 'jquery';
import _ from 'lodash';

class ProgressBarR {
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
      thumbBg,
      trackBg,
      tip: {
        fontFamily: tipFontFamily,
        color: tipColor,
        fontSize: tipFontSize,
        fontWeight: tipFontWeight
      }
    } = this.config;
    const wrapWidth = this.container.width();
    const wrapHeight = this.container.height();
    const roundWidth = Math.min(wrapWidth, wrapHeight);
    const tpl = `
      <div class="boss-progress-bar r" style="
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
            font-family: ${tipFontFamily}; 
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
    `;
    this.container.html(tpl);
    this.dynamicEffect();
  }

  dynamicEffect() {
    const { value, total } = this.data[0];
    const {
      tip: {
        tipFix,
        isRealValue
      }
    } = this.config;
    let degree = (value / total) * 360;
    const textEl = this.container.find('.progress-bar-round-tip');
    const rightEl = this.container.find('.circle.right');
    const leftEl = this.container.find('.circle.right');
    degree > 360 && (degree = 360);
    degree < 0 && (degree = 0);

    $({ property: 0 }).animate(
      { property: 100 },
      {
        duration: 600,
        step() {
          let deg = (this.property / 100) * degree;
          const text = `${((this.property / 100) * (isRealValue ? value : (value / total) * 100)).toFixed(tipFix)}${isRealValue ? '' : '%'}`;
          if (deg <= 180) {
            rightEl.css('-webkit-transform', `rotate(${-135 + deg}deg)`);
            textEl.text(text);
          } else {
            deg -= 180;
            rightEl.css('-webkit-transform', 'rotate(45deg)');
            leftEl.css('-webkit-transform', `rotate(${-135 + deg}deg)`);
            textEl.text(text);
          }
        }
      }
    );
  }

  resize() {
    this.render(this.data, this.config);
  }
}

module.exports = ProgressBarR;

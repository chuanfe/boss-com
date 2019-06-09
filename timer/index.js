import $ from 'jquery';
import _ from 'lodash';

const farmatDate = (format) => {
  const nowdate = new Date();
  const ObjTime = {
    'y+': nowdate.getDate(),
    'M+': nowdate.getMonth() + 1,
    'd+': nowdate.getDate(),
    'H+': nowdate.getHours(),
    'm+': nowdate.getMinutes(),
    's+': nowdate.getSeconds(),
    S: nowdate.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (`${nowdate.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (var i in ObjTime) {
    var n = ObjTime[i];
    if (new RegExp("(" + i + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
  }
  return format;
};

class RealTTime {
  constructor(container, config) {
    this.container = $(container);
    this.timer;
    this.config = _.merge(
      {
        event: {
          interval: 3000
        }
      },
      config
    );
    this.render();
  }

  render(data, config) {
    if (!data) {
      data = this.data;
    }
    this.data = data;
    this.config = _.merge({}, this.config, config);
    this.container.html('<div class="boss-timer-container"></div>');
    this.date = this.container.find('.boss-timer-container');
    const {
      textAlign,
      fontSize,
      fontWeight,
      fontFamily,
      color,
      backgroungColor
    } = this.config.time.textStyle;
    this.container.css({
      'display': 'flex',
      'justify-content': textAlign,
      'align-items': 'center',
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
      'font-size': fontSize,
      'font-weight': fontWeight,
      'font-family': `"${fontFamily}"`,
      'color': color,
      'background-color': backgroungColor
    });
    this.runTimer();
  }

  runTimer() {
    const {
      format,
      duration
    } = this.config.time;
    this.date.html(farmatDate(format));
    this.timer = setTimeout(this.runTimer.bind(this), duration);
  }
  resize() {
    this.render(this.data, this.config);
  }

  destroy() {
    clearTimeout(this.timer);
    this.timer = null;
    this.data = null;
    this.container.empty();
  }
}

module.exports = RealTTime;






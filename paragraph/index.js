import $ from 'jquery';
import _ from 'lodash';
class Paragraph {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge({}, config);
    this.timer;
  }

  render(data, config) {
    if (!data) {
      data = this.data;
    }
    this.data = data;
    this.config = _.merge({}, this.config, config);
    this.timer && clearTimeout(this.timer);
    this.container.css({
      overflow: 'hidden'
    });
    this.content = $('<div class="boss-paragraph-container"></div>');
    const html = (this.data && this.data[0] && this.data[0].value) || content;
    this.content.html(html);
    const {
      textAlign,
      textStyle,
      lineHeight,
      textIndent,
      scroll
    } = this.config;
    this.content.css({
      textAlign: textAlign,
      color: textStyle.color,
      'font-weight': textStyle.fontWeight,
      'font-family': `'${textStyle.fontFamily}'`,
      'font-size': `${textStyle.fontSize}px`,
      lineHeight: `${lineHeight}px`,
      textIndent: `${textIndent}px`
    });

    this.container.html(this.content);
    this.duration = scroll.duration;
    if (this.content.height() >= this.container.height() && scroll.overScroll) {
      this.container.empty();
      this.bigCon = $('<div class="bigCon"></div>');
      this.bigCon.append(this.content);
      this.bigCon.append(this.content.clone());
      this.container.html(this.bigCon);
      this.animation(this.config)
    } else {
      this.container.empty();
      this.container.html(this.content);
    }
  }

  animation() {
    const _self = this;
    _self.timer && clearTimeout(_self.timer);
    _self.bigCon.css({
      transform: `translateY(-${_self.content.height()}px)`,
      transition: `transform ${_self.duration / 1e3}s linear`
    });
    this.timer = setTimeout(() => {
      _self.bigCon.css({
        transform: 'translateY(0)',
        transition: 'transform 0s linear'
      });
      _self.animation();
    }, _self.duration);
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

module.exports = Paragraph;






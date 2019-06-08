
import $ from 'jquery';
import _ from 'lodash';

class ShapeLine {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {
        width: 150,
        height: 50
      },
      config
    );
    this.init();
  }

  init() {
    const tpl = `
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <line x1="30"></line>
      </svg>`;
    this.container.html(tpl);
    this.render(null, this.config);
  }

  render(data, config) {
    this.config = _.merge(
      {},
      this.config,
      config
    );
    const {
      width,
      height,
      ...rest
    } = this.config;
    this.container.find('svg').attr({
      viewBox: `0 0 ${width} ${height}`
    });
    this.container.find('line').attr({
      y1: height / 2,
      x2: width - 30,
      y2: height / 2,
      ...rest
    });
  }

  resize(width, height) {
    this.render(null, {
      width,
      height
    });
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = ShapeLine;


import $ from 'jquery';
import _ from 'lodash';

class ShapeCircle {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {},
      config
    );
    this.init();
  }

  init() {
    const tpl = `
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" style="width: 100%; height: 100%;">
        <circle cx="50%" cy="50%" r="40%"></circle>
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
    this.container.find('circle').attr(config);
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = ShapeCircle;

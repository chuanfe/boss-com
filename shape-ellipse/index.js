
import $ from 'jquery';
import _ from 'lodash';

class ShapeEllipse {
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
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" style="width: 100%; height: 100%;">
        <ellipse cx="150" cy="100" rx="120" ry="80"></ellipse>
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
    this.container.find('ellipse').attr(config);
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = ShapeEllipse;

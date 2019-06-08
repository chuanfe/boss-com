
import $ from 'jquery';
import _ from 'lodash';

class ShapeIsoscelesTriangle {
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
        <polygon points="30,180 270,180 150,20"></polygon>
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
    this.container.find('polygon').attr(config);
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = ShapeIsoscelesTriangle;

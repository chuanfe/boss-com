
import $ from 'jquery';
import _ from 'lodash';

class ShapeArrow {
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
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="width: 100%; height: 100%;">
        <path d="M7.4 12.5l-3.6-3.5h12.2v-2h-12.2l3.6-3.5-1.5-1.4-5.9 5.9 5.9 5.9z"></path>
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
    this.container.find('path').attr(config);
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = ShapeArrow;

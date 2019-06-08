
import $ from 'jquery';
import _ from 'lodash';

class ShapeRectangle {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {
        width: 150,
        height: 100
      },
      config
    );
    this.init();
  }

  init() {
    const tpl = ' <div style="position: absolute; top: 50%; left: 50%; border-style: solid;"></div>';
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
      height
    } = this.config;
    this.container.find('div').css({
      marginTop: -(height / 2),
      marginLeft: -(width / 2),
      ...config
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

module.exports = ShapeRectangle;

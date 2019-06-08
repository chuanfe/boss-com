
import $ from 'jquery';
import _ from 'lodash';
import xss from 'xss';

class SingleImg {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {},
      config
    );
  }

  render(data, config) {
    const repeatToSize = {
      'no-repeat': '100% 100%',
      'repeat-x': 'auto 100%',
      'repeat-y': '100% auto',
      repeat: 'auto auto'
    };
    if (!data) {
      data = this.data;
    }
    this.data = data;
    this.config = _.merge(
      {},
      this.config,
      config
    );
    this.config.backgroundSize = repeatToSize[this.config.backgroundRepeat];
    const {
      urlConfig,
      ...restConfig
    } = this.config;
    const {
      url,
      ifBlank
    } = urlConfig;
    this.container.css(
      'backgroundImage',
      `url("${data[0].img ? data[0].img : restConfig.backgroundImage}"`
    );
    if (data[0].url || url) {
      this.container.html(xss(`<a href="${data[0].url || url}" ${ifBlank ? 'target="_blank"' : ''}></a>`));
    } else {
      this.container.html('');
    }

    this.container.find('a').css({
      display: 'block',
      width: '100%',
      height: '100%'
    });

    this.container.css(restConfig);
  }

  resize(width, height) {
    this.render(null, {
      width,
      height
    });
  }

  destroy() {
    this.container.empty();
    this.container.css('background', '');
  }
}

module.exports = SingleImg;

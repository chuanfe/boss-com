
import $ from 'jquery';
import _ from 'lodash';
import './index.less';

class Iframe {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {},
      config
    );
    this.data = null;
    this.init();
  }

  init() {
    const tpl = '<iframe class="boss-iframe boss-full-iframe" src=""></iframe>';
    this.container.html(tpl);
  }

  render(data, config) {
    if (!data) {
      data = this.data;
    }
    this.data = data;
    this.config = _.merge(
      {},
      this.config,
      config
    );

    let {
      url
    } = this.config;
    url = data[0].url ? data[0].url : url;
    /(http|https):\/\//.test(url) || (url = '');
    this.container.find('iframe').attr({
      src: url
    });
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = Iframe;

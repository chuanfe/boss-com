
import $ from 'jquery';
import _ from 'lodash';
import xss from 'xss';

class SingTitle {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {
        textStyle: {
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          overflow: 'hidden'
        }
      },
      config
    );
    this.container = $(container).css({
      display: 'flex',
      'align-items': 'center'
    });
  }

  render(data, config) {
    const algnToJustifyContent = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end'
    };
    if (!data) {
      data = this.data;
    }
    this.data = data;
    this.config = _.merge({}, this.config, config);
    this.config.textStyle['justify-content'] = algnToJustifyContent[this.config.textStyle.textAlign];
    delete this.config.textStyle.textAlign;
    const {
      content,
      textStyle,
      urlConfig
    } = this.config;
    const {
      url,
      ifBlank,
      color,
      ifUnderline
    } = urlConfig;
    const _content = data[0].value || content;
    if (data[0].url || url) {
      this.container.html(xss(`<a href="${data[0].url || url}" ${ifBlank ? 'target="_blank"' : ''}>${_content}</a>`, {
        whiteList: {
          a: ['href', 'title', 'target']
        }
      }));
    } else {
      this.container.text(_content);
    }

    this.container.css(textStyle);

    const $link = this.container.find('a');

    $link.css({
      display: 'block',
      color: textStyle.color,
      'text-decoration': 'none'
    });
    $link.hover(
      () => {
        $link.css({
          color,
          'text-decoration': ifUnderline ? 'underline' : 'none'
        });
      },
      () => {
        $link.css({
          color: textStyle.color,
          'text-decoration': 'none'
        });
      }
    );
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = SingTitle;

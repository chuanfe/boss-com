import $ from 'jquery';
import _ from 'lodash';
import Swiper from 'swiper';
import './index.less';
import 'swiper/dist/css/swiper.css';
class SwiperImg {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge({
      width: '600',
      height: '338'
    }, config);
    this.timer;
  }

  render(data, config) {
    if (!data) {
      data = this.data;
    }
    this.data = data;
    this.config = _.merge({}, this.config, config);
    this.swiper = null;
    this.container.find('.swiper-container').remove();
    let html = '';
    if (this.config.description.show) {
      const {
        color,
        fontWeight,
        align,
        background,
        fontSize
      } = this.config.description;
      const {
        opacity,
        fillType
      } = this.config.imgconfig;
      let _fillType = '';
      switch (fillType) {
        case 1:
        _fillType = 'auto';
        break;
        case 2:
        _fillType = '100%';
        break;
        case 3:
        _fillType = '100%';
        break;
        case 4:
        _fillType = 'cover';
        break;
        case 5:
        _fillType = '100% 100%';
        break;
      }
      const titlepos = (this.config.description.horpos === 'top' ? 'top: 0px;' : 'bottom: 0px;');
      for (let i = 0; i < this.data.length; i++) {
        let linkHtml = '';
        if (this.data[i] && this.data[i].link) {
          linkHtml = `<a target="_blank" style="position: absolute;display: block; width: 100%; height: 100%" href="${this.data[i].link}"></a>`;
        }
        html += `<div class="swiper-slide">${linkHtml}
               <span style="position: absolute; width: 100%; padding: 6px 0; font-size: ${fontSize}px;
               color: ${color}; 
               background-color: ${background};
               font-weight: ${fontWeight}; ${titlepos}text-align: ${align}">${this.data[i].description}</span>
               <div style="width:100%;height: 100%; opacity: ${opacity}; background:url(${this.data[i].url}) center center / ${_fillType} no-repeat;"></div></div>`;
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        html += `<div class="swiper-slide"><img style="width:100%;height: 100%" src="${this.data[i].url}"></div>`;
      }
    }

    this.content = $('<div class="swiper-wrapper"></div>');
    this.containerHtml = $(`<div class="swiper-container" id="test1" 
    style="width: ${this.config.width}px;height: ${this.config.height}px"></div>`);
    this.content.html(html);
    this.containerHtml.css({
      width: `${this.config.width}px !important`,
      height: `${this.config.height}px !important`,
    })
    this.config.imgconfig.dot && (this.pagination = $('<div class="swiper-pagination"></div>'));
    this.config.imgconfig.pagination && (this.swiperBtn = $('<div class="swiper-button-next"></div><div class="swiper-button-prev"></div>'));
    this.containerHtml.append(this.content);
    this.config.imgconfig.dot && this.containerHtml.append(this.pagination.clone());
    this.config.imgconfig.pagination && this.containerHtml.append(this.swiperBtn.clone());
    this.container.append(this.containerHtml);
    this.swiper = new Swiper('#test1', {
      direction: `${this.config.animate.direction}`,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      autoplay: {
        delay: `${this.config.animate.interval}`,
        disableOnInteraction: false,
      },
      speed: this.config.animate.speed
    });

    // 小圆点位置 
    if (this.config.description.horpos !== 'top') {
      $('.swiper-pagination').css({
        bottom: 'calc(100% - 20px)'
      })
    }

  }
  resize(_width, _height) {
    this.config.width = _width;
    this.config.height = _height;
    this.render(this.data, this.config);
  }

  destroy() {
    this.container.empty();
  }
}

module.exports = SwiperImg;






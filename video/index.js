
import $ from 'jquery';
import _ from 'lodash';
import videojs from 'video.js/dist/video.js';
import zhCN from 'video.js/dist/lang/zh-CN.json';
import 'video.js/dist/video-js.css';
import './index.less';

class Video {
  constructor(container, config) {
    this.container = $(container);
    this.config = _.merge(
      {
        width: 300,
        height: 150
      },
      config
    );
    this.data = null;
    this.video = null;
    videojs.addLanguage('zh-CN', zhCN)
  }

  render(data, config) {
    if (!data) {
      data = this.data; 
    }
    this.data = data;

    if (config) {
      this.config = _.merge(
        {},
        this.config,
        config
      );
    }

    const {
      volume,
      controls,
      poster,
      url,
      autoplay,
      loop,
      muted,
      width,
      height
    } = this.config;

    const tpl = `
      <video 
        class="video-js vjs-default-skin vjs-big-play-centered"
        webkit-playsinline playsinline x5-playsinline controls
        data-setup="{}" 
        preload="auto"
      >
        <source src=""/>
      </video>`;
    this.video && this.destroy();
    this.container.html(tpl);
    this.video = videojs(
      this.container.find('video')[0],
      {
        language: 'zh-CN',
        controls,
        poster: data[0].poster ? data[0].poster : poster,
        autoplay,
        loop,
        muted,
        width,
        height,
        sources: [
          {
            src: data[0].url ? data[0].url : url
          }
        ],
      });
    this.video.volume(volume / 100);
  }

  resize(width, height) {
    this.config = _.merge(
      {},
      this.config,
      {
        width,
        height
      }
    );
    this.video.width(width);
    this.video.height(height);
  }

  destroy() {
    this.video.dispose();
    this.container.empty();
  }

}

module.exports = Video;
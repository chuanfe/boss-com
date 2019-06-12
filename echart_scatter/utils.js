import _ from 'lodash';

module.exports = {
  isMultiColor(o) {
    return o && o.style && (o.value || (o.from && o.to));
  },
  fixConfigToEchart(config) {
    if (!config) {
      return;
    }
    config = _.merge(
      {
        tooltip: {
          textStyle: {}
        },
        series: [{
          textStyle: {
            normal: {},
            emphasis: {}
          }
        }]
      },
      config
    );
    const {
      global
    } = config;
    const {
      mainColor,
      textStyle
    } = global;

    // color 合并全局mainColor配置项
    config.color = _.map(mainColor, m => m);
    config.textStyle = textStyle;

    return config;
  }
};


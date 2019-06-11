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
      global,
      series
    } = config;
    const {
      mainColor,
      textStyle
    } = global;

    // color 合并全局mainColor配置项
    config.color = _.map(mainColor, m => m);

    // tooltip.textStyle 合并全局textStyle配置项
    config.tooltip.textStyle = _.merge({}, textStyle, config.tooltip.textStyle);

    // series.textStyle 合并全局textStyle配置项
    series.forEach((m) => {
      m.textStyle.normal = _.merge({}, textStyle, m.textStyle.normal);
    });

    return config;
  }
};


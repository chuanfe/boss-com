import _ from 'lodash';
import EChart from 'echarts';
isMultiColor = function (a) {
  return a && a.style && (a.value || a.from && a.to)
}

var g = Math.sin
  , h = Math.cos
  , i = Math.cos
  , j = EChart;
const m = 3.14;
function e(a) {
  return 2 * m * a / 360
}
function d(a, b) {
  var d = Math.tan
    , f = Math.abs;
  if (void 0 === a)
    return b;
  var j = b
    , k = e(a)
    , l = g(k)
    , m = h(k)
    , c = g(e(45));
  return 0 < m && f(l) < c ? j = [1, 0.5 + 0.5 * d(k)] : 0 < l && f(m) <= c ? j = [0.5 + 0.5 * i(k), 1] : 0 > m && f(l) < c ? j = [0, 0.5 - 0.5 * d(k)] : 0 > l && f(m) <= c ? j = [0.5 - 0.5 * i(k), 0] : console.log("sorry!"),
    j
}

config2echartsOptions = function (a) {
  if (isMultiColor(a)) {
    if ("single" === a.style)
      return a.value;
    let b = d(a.angle + 180, [0, 0]).concat(d(a.angle, [0, 1]));
    return new j.graphic.LinearGradient(b[0], b[1], b[2], b[3], [{
      offset: 0,
      color: a.from
    }, {
      offset: 1,
      color: a.to
    }])
  }
  return "object" === typeof a && _.forIn(a, function (b, c) {
    a[c] = config2echartsOptions(b)
  }),
    a && a.series && !Array.isArray(a.series) && (a.series = [a.series]),
    a
}

module.exports = {
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
    config = config2echartsOptions(config);
    // tooltip.textStyle 合并全局textStyle配置项
    //config.tooltip.textStyle = _.merge({}, textStyle, config.tooltip.textStyle);
    // series.textStyle 合并全局textStyle配置项
    // series.forEach((m) => {
    //   m.textStyle.normal = _.merge({}, textStyle, m.textStyle.normal);
    // });
    return config;
  }
};

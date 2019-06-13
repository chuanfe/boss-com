/*
 * @Author: linyee.lqBai
 * @Date: 2019-06-10 19:17:34
 * @LastEditors: linyee.lqBai
 * @LastEditTime: 2019-06-13 10:44:21
 * @Description: 数字滚动插件
 */

module.exports = function ($) {
  $.fn.numberAnimate = function (setting) {
    const defaults = {
      speed: 1000, // 动画速度
      num: '', // 初始化值
      iniAnimate: true, // 是否要初始化动画效果
      symbol: '', // 默认的分割符号，千，万，千万
      dot: 0, // 保留几位小数点
      pct: '', // 是否有 百分号,
      border: {}
    };
    // 如果setting为空，就取default的值
    const _setting = $.extend(defaults, setting);

    const { border: { show, builtInBorder } } = _setting;
    // 如果对象有多个或者未设置初始化值，提示出错
    if ($(this).length > 1 || _setting.num === '') {
      // TODO 后续完善
      return;
    }
    console.log(show);
    const nHtml = `
        <div class="number-flip-dom-bg ${show ? `hasBorder ${builtInBorder}` : ''}">
            <div class="number-flip-dom" data-num="{{num}}"
                style="top: ${show ? -10 : 0}px"
            >
                <span class="number-flip-span">0</span>
                <span class="number-flip-span">1</span>
                <span class="number-flip-span">2</span>
                <span class="number-flip-span">3</span>
                <span class="number-flip-span">4</span>
                <span class="number-flip-span">5</span>
                <span class="number-flip-span">6</span>
                <span class="number-flip-span">7</span>
                <span class="number-flip-span">8</span>
                <span class="number-flip-span">9</span>
                <span class="number-flip-span">0</span>
                <span class="number-flip-span">.</span>
            </div>
        </div>

    `;
    const addZero = function (number, bitNum) {
      let sx = number.toString();
      let posDecimal = sx.indexOf('.');
      if (posDecimal < 0) {
        posDecimal = sx.length;
        sx += '.';
      }
      while (sx.length <= posDecimal + bitNum) {
        sx += '0';
      }
      return sx;
    };
    // 数字处理
    const numToArr = function (num) {
      // 处理小数自动补零的问题
      console.log(addZero(num, _setting.dot));
      let sx = num.toString();
      // 获取小数位数
      if (sx.indexOf('.') > -1 && (sx.length - sx.indexOf('.')) < _setting.dot) {
        while (sx.length <= sx.indexOf('.') + _setting.dot) {
          sx += '0';
        }
        num = sx;
      } else {
        num = parseFloat(num).toFixed(_setting.dot);
      }
      if (typeof (num) === 'number') {
        return num.toString().split('');
      }
      return num.split('');
    };

    // 设置DOM symbol:分割符号
    const setNumDom = function (arrStr) {
      // 解决千分位处理异常的问题
      const intLen = (Math.floor(+arrStr.join(''))).toString().split('').length;
      let shtml = '<div class="number-flip">';
      for (let i = 0, len = arrStr.length; i < len; i++) {
        if (i !== 0 && intLen > i && (intLen - i) % 3 === 0 && _setting.symbol !== '' && arrStr[i] !== '.') {
          shtml += `<div class="number-flip-dot">${_setting.symbol}</div>${nHtml.replace('{{num}}', arrStr[i])}`;
        } else {
          shtml += nHtml.replace('{{num}}', arrStr[i]);
        }
      }
      if (_setting.pct) {
        shtml += '%</div>';
      } else {
        shtml += '</div>';
      }
      return shtml;
    };

    // 执行动画
    const runAnimate = function ($parent) {
      $parent.find('.number-flip-dom').each(function () {
        let num = $(this).attr('data-num');
        num = (num === '.' ? 11 : num === 0 ? 10 : num);
        const spanHei = $(this).height() / 12; // 11为元素个数
        const thisTop = `${-num * spanHei}px`;
        console.log(thisTop, $(this).css('top'));
        if (thisTop !== $(this).css('top')) {
          if (_setting.iniAnimate) {
          // HTML5不支持
            if (!window.applicationCache) {
              $(this).animate({
                top: thisTop
              }, _setting.speed);
            } else {
              $(this).css({
                transform: `translateY(${thisTop})`,
                '-webkit-transform': `translateY(${thisTop})`,
                '-webkit-transition': `${_setting.speed / 1000}s`,
                transition: `transform ${_setting.speed / 1000}s`
              });
            }
          } else {
            _setting.iniAnimate = true;
            console.log('change');
            $(this).css({
              top: thisTop
            });
          }
        }
      });
    };

    // 初始化
    const init = function ($parent) {
      // 初始化
      $parent.html(setNumDom(numToArr(_setting.num)));
      runAnimate($parent);
    };

    // 重置参数
    this.resetData = function (num) {
      const newArr = numToArr(num);
      const $dom = $(this).find('.number-flip-dom');
      if ($dom.length < newArr.length) {
        $(this).html(setNumDom(numToArr(num)));
      } else {
        $dom.each(function (index) {
          $(this).attr('data-num', newArr[index]);
        });
      }
      runAnimate($(this));
    };
    // init
    init($(this));
    return this;
  };
};

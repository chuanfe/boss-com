const Event = require("bcore/event");
const $ = require("jquery");
const _ = require("lodash");
const anime = require("animejs");

module.exports = Event.extend(function (container, config) {
  console.log('constructor')
  this.container = $(container);
  this.config = {
    width: this.container.width(),
    height: this.container.height(),
    "background-color": "transparent",
    theme: {},
    global: {
      animation: {
        singleStop: !1
      },
      ifRowHidden: !1,
      textAnimate: {
        ifRun: !1,
        animateDur: 2
      },
      ifUpdateImd: !1
    }
  };
  // 表头渲染函数
  this.headerTpl = (header) => `
    <div class="line header" style="
      display: flex;
      align-items: center;
      background-color: ${header.backgroundColor};
      height: ${header.height}px;
      text-overflow: 
      ellipsis;
      white-space: nowrap;
      overflow: hidden;
      vertical-align: middle;
      color: ${header.color};"
    >
      ${header.hasIndex && `
        <div class="index-list" style="
          display: inline-block;
          vertical-align: middle;
          width: ${header.idListWidth}%;
          height: ${header.height}px;"
        ></div>
      `}
      ${header.column}
    </div>
  `
  // 表行渲染函数
  this.rowTpl = (row) => `
    <div class="line row-content" style="
      height: ${row.height}px;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle; 
      display: flex;
      align-items: center;
      background-color: ${row.bgColor};"
    >
      ${row.hasIndex && `
        <div class="index" style="
          display: inline-block;
          text-align: center;
          vertical-align: middle;
          width: ${row.idListWidth}%;
          color: ${row.idListColor};
          font-size: ${row.idListFontSize}px;"
        >
          <div class="index-bg" style="
            background-color: ${row.idListBgColor}; 
            font-weight: ${row.fontWeight}; 
            width: ${row.bgSize}px;
            height: ${row.bgSize}px;
            line-height: ${row.bgSize}px;
            vertical-align: middle;
            margin: auto;
            border-radius: ${row.radius}px;
            text-align: center;"
          >
          </div>
        </div>
      `}
    </div>
  `

  // cell渲染函数
  this.cellTpl = cell => `
    <div class="${cell.classname}" style="
      width: ${cell.width}%;
      display:inline-block;
      text-align: ${cell.textAlign};
      ${cell.isBr ? `word-break:break-all;` : `white-space: nowrap;`}
      overflow: hidden;
      vertical-align: middle;
      background-color: transparent;
      font-size: ${cell.fontSize}px;
      color: ${cell.color};
      font-weight: ${cell.fontWeight};"
    >
      ${cell.content}
      <div class="marquee-text" style="display: inline-block;">
        <span style="display: inline-block;" class="marquee-text-span"></span>
        <i class="whiteSpace" style="display:inline-block;width:${cell.whiteWidth};"></i>
        ${cell.ifRun && !cell.isBr ?  `
          <span style="display: inline-block;" class="marquee-text-span"></span>
          <i class="whiteSpace" style="display:inline-block;width:${cell.whiteWidth};"></i>
        ` : ''}
      </div>
    </div>
  `
  this._data = null,
  this.apis = config.apis,
  this.isInit = !0,
  this.startIndex = 0,
  this.titleList = [],
  this.textTimer = {},
  this.init(config);
}, {
  init: function (config) {
    console.log('init')
    this.mergeConfig(config);
    this.updateStyle();
    this.initInteraction();
  },
  // 绑定交互事件
  initInteraction: function () {
    var self = this;
    self.container.css("cursor", "pointer");
    self.container.off("mouseenter").off("mouseleave").on("mouseenter", function () {
      self.removeTimer()
    }).on("mouseleave", function (e) {
      var c = e.toElement || e.relatedTarget;
      if(!this.contains(c) && self.config.global.isLoop) {
        self.mouseTimer = setTimeout(
          self.loop.bind(self), 
          1e3 * self.config.global.animation.duration
        )
      }
    })
  },
  initPool: function () {
    this.dataPool = [];
  },
  // 设置表格头
  setHeader: function (series, header) {
    let headerHtml = '';
    series.forEach(serie => {
      headerHtml += this.cellTpl({
        width: serie.width,
        height: header.height,
        content: serie.displayName,
        textAlign: header.textStyle.textAlign,
        whiteWidth: 0,
        classname: "column column-title",
        isBr: header.isBr,
        ifRun: this.config.global.textAnimate.ifRun,
        fontSize: header.textStyle.fontSize,
        color: header.textStyle.color,
        fontWeight: header.textStyle.fontWeight
      });
    })

    header.column = headerHtml;
    header.color = header.textStyle.color;
    header.fontSize = header.textStyle.fontSize;
    header.fontWeight = header.textStyle.fontWeight;

    this.container.append(this.headerTpl(header))
  },
  setRowNodeStr: function (rowStyle) {
    this.rowStr = this.rowTpl(rowStyle)
  },
  appendRow: function (rowCount, series) {
    const self = this;
    for (var i = 0; i < rowCount; i++) {
      const rowBg2 = this.config.row.backgroundColor2;
      let $rowEl = $(this.rowStr);
      let rowStr = "";

      1 === i % 2 && $rowEl.css({
        "background-color": rowBg2
      });
      series.forEach(serie => {
        rowStr += this.cellTpl({
          width: serie.width,
          height: serie.height,
          content: "",
          bgColor: serie.backgroundColor,
          textAlign: serie.textStyle.textAlign,
          whiteWidth: 0,
          classname: "column cell-content",
          isBr: serie.isBr,
          ifRun: self.config.global.textAnimate.ifRun,
          fontSize: serie.textStyle.fontSize,
          color: serie.textStyle.color,
          fontWeight: serie.textStyle.fontWeight
        })
      })
      $rowEl.append(rowStr);
      $rowEl.on("click", function () {
        var data = $(this).data("data");
        self.emit("row-clicked", data);
      })
      this.container.append($rowEl)
    }
  },
  // 移除所有定时器
  removeTimer: function () {
    this.timer && clearTimeout(this.timer);
    this.mouseTimer && clearTimeout(this.mouseTimer);
    this.visibleTimer && clearTimeout(this.visibleTimer);
    this.timer = null;
    this.mouseTimer = null;
    this.visibleTimer = null;
    this.removeTextTimer();
  },
  // 清除指定文字滚动定时器
  removeTargetTextTimer: function (textTimerId) {
    if(this.textTimer[textTimerId]) {
      this.textTimer[textTimerId].pause && this.textTimer[textTimerId].pause();
      his.textTimer[a] = null;
    }
  },
  // 清除所有文字滚动定时器
  removeTextTimer: function () {
    _.map(this.textTimer, (v, i) => {
      if(v) {
        v.seek && v.seek(0);
        v.pause && v.pause();
      }
      delete this.textTimer[i];
    })
  },
  // 初始化轮播列表
  initRank: function () {
    console.log('initRank')
    var cfg = this.config;
    this.removeTimer();
    this.initPool();
    this.container.find(".row-content").off("click"); 
    this.container.empty();
    this.container.css({
      overflow: "hidden",
      "background-color": cfg["background-color"]
    });

    const {header, idList, series } = cfg;

    this.columnNameList = _.map(series, "columnName");
    console.log(this.columnNameList);
    if(header.show) {
      header.hasIndex = idList.show;
      header.idListWidth = idList.width;
      header.height = cfg.height * (header.heightPercent / 100);
      this.setHeader(series, header);
    } else {
      header.height = 0;
    }
    var rowCount = cfg.global.rowCount;

    var rowStyle = {
      rowCount: rowCount,
      height: (cfg.height - header.height) / rowCount,
      hasIndex: idList.show,
      idListWidth: idList.width,
      idListRadius: idList.radius,
      idListBgColor: idList.backgroundColor,
      idListColor: idList.textStyle.color,
      idListFontSize: idList.textStyle.fontSize,
      bgColor: cfg.row.backgroundColor1,
      fontWeight: idList.textStyle.fontWeight,
    };
    rowStyle.bgSize = Math.min(Math.floor(this.container.width() * idList.width / 100), rowStyle.height) * rowStyle.idListRadius / 100 - 4,
    rowStyle.radius = rowStyle.bgSize / 2;

    this.setRowNodeStr(rowStyle);
    this.appendRow(rowCount*2, series);
  },
  updateData: function (data) {
    data && (this.dataPool = data);
  },
  // 获取展示的数据
  getData: function (dataPool, startIndex, rowCount) {
    const filterData = [];
    if(startIndex > dataPool.length - 1) { // 截取位置超出数组长度
      if("bottom" === this.config.global.animation.mode && 0 < dataPool.length) {
        startIndex %= dataPool.length;
      } else {
        startIndex = 0;
      }
    }
    for (var i = startIndex; i < startIndex + rowCount; i++) {
      if (dataPool[i] && undefined !== dataPool[i]) {
        var k = _.cloneDeep(dataPool[i]);
        k.index = i + 1,
        filterData.push(k);
      } else
      filterData.push({})
    }
    return {
      data: filterData,
      index: startIndex
    }
  },
  setStartIndex: function (dataPool, startIndex, step) {
      startIndex += step;
      startIndex > dataPool.length - 1 && (startIndex = 0),
      this.startIndex = startIndex;
  },
  initFill: function (dataPool, startIndex) {
    const cfg = this.config;
    const series = cfg.series;
    const columnNameList = this.columnNameList || [];
    $rows = this.container.find(`.row-content:lt(${cfg.global.rowCount})`);
    $rows.each(function (index, rowEl) {
      var item = dataPool[startIndex + index];
      const $row = $(rowEl);
      if(item) {
        $row.find(".cell-content").each(function (cIndex, cellEl) {
          var i = columnNameList[cIndex];
          const j = series[cIndex].dataType;
          let renderStr = "";
          if("img" === j) {
            renderStr = `<img src="${item[i] || ""}" style="width: ${series[cIndex].widthPercent}%; height: 100%" />`;
          } else if(item[i] || 0 === +item[i]) {
            renderStr = item[i];
          } else {
            renderStr = "-";
          }
          const $mt = $(cellEl).find(`.marquee-text`);
          const $mtSpan = $(cellEl).find(`.marquee-text`).find(".marquee-text-span");
          $mtSpan.html(renderStr);
          $mt.attr("indexnum", `${startIndex + index + 1}-${cIndex}`);
        });
        $row.data("data", item);
        $row.find(".index-bg").html(startIndex + index + 1);
      }
    });
    this.setStartIndex(dataPool, startIndex, cfg.global.rowCount);
  },
  // 计算转换值
  calTransform: function (alignType, b) {
    const c = b.find(".marquee-text-span");
    if(alignType === 'left') {
      return 0;
    } else if(alignType === 'center') {
      return b.width() / 2 - c.width() / 2;
    } else if(alignType === 'right') {
      return b.width() - c.width() - 1;
    } else {
      return 0;
    }
  },
  // 填充文字
  fillCell: function (a, b) {
    const self = this;
    const cfg = this.config;
    var startIndex = a.index;
    var rowBg1 = cfg.row.backgroundColor1;
    var rowBg2 = cfg.row.backgroundColor2;
    let $rows = this.container.find(`.row-content:gt(${cfg.global.rowCount - 1})`);
    b && ($rows = this.container.find(`.row-content:lt(${cfg.global.rowCount})`));

    $rows.each(function (rowIndex, rowEl) {
      var rowObj = a.data[rowIndex];
      var realIndex = startIndex + rowIndex + 1;
      if (rowObj) {
        if (0 === Object.keys(rowObj).length && cfg.global.ifRowHidden) {
          return $(rowEl).css("opacity", 0);
        }
        $(rowEl).css("opacity", 1);
        $(rowEl).find(".cell-content").each(function (cellIndex, cellEl) {
          var i = self.columnNameList[cellIndex];
          var j = self.config.series[cellIndex].dataType;
          var renderStr = "";
          if("img" === j) {
            renderStr = `<img src="${rowObj[i] || ""}" style="width: ${cfg.series[cellIndex].widthPercent}%; height:100%;" />`
          } else if(rowObj[i] || 0 === +rowObj[i]) {
            renderStr = rowObj[i];
          } else {
            renderStr = "-";
          }
          var $mt = $(this).find(`.marquee-text`);
          var $mtSpan = $(this).find(`.marquee-text`).find(".marquee-text-span");
          var indexNum = `${realIndex}-${cellIndex}`;
          $mtSpan.html(k);
          $mt.attr("indexnum", indexNum);
          $(cellEl).find(".whiteSpace").css({
            width: $(cellEl).width() - $($mtSpan[0]).width() - 1
          });
          if(j !== 'img') {
            $mt.css("transform", `translateX(${self.calTransform(cfg.series[cellIndex].textStyle.textAlign, $(this))}px)`);
          }
          // 不自动换行 且 设置了溢出文本滚动 且 文字溢出
          if(!cfg.series[cellIndex].isBr && cfg.global.textAnimate.ifRun && $mtSpan.width() > $(this).width() && $mt.attr("indexnum") === indexNum) {
            self.removeTargetTextTimer(indexNum);
            self.textRun(indexNum, $mt, cellIndex);
          }
        }),
        $(rowEl).css("background-color", 0 == realIndex % 2 ? rowBg1 : rowBg2),
        $(rowEl).data("data", rowObj),
        $(rowEl).find(".index-bg").html(realIndex)
      }
    })
  },
  // 溢出文本滚动
  textRun: function (textTimerId, $mt, cellIndex) {
    const { global: { textAnimate: {animateDur} }, series} = this.config;
    setTimeout(() => {
      this.textTimer[textTimerId] = anime({
        targets: $mt[0],
        translateX: -$mt.outerWidth() / 2 + this.calTransform(series[cellIndex].textStyle.textAlign, $mt.parent()),
        duration: 1e3 * animateDur,
        loop: true,
        delay: 500,
        easing: "linear"
      });
    }, 0)
  },
  // 动画
  animation: function () {
    var aniEl = this.config.global.animation.mode === "bottom" ? 
      this.container.find(".row-content:first") : 
      this.container.find(`.row-content:lt(${this.config.global.rowCount})`);
    let count = 0;
    const aniCb = () => {
      count ++;
      if (count >= aniEl.length) {
        aniEl.off("transitionend", aniCb);
        const fragment = document.createDocumentFragment();
        aniEl.each((i, el) => {
          fragment.appendChild(el)
        }),
        this.container[0].appendChild(fragment);
        aniEl.css({
          transition: "none",
          height: (this.config.height - this.config.header.height) / this.config.global.rowCount + "px"
        })
      }
    }
    aniEl.on("transitionend", aniCb);
    aniEl.css({
      height: 0,
      transition: "height 400ms linear"
    })
  },
  // 轮播
  loop: function () {
    let {global: {animation: {mode, duration}, rowCount}} = this.config;
    this.removeTimer();
    if (this.dataPool) {
      var step;
      if(mode === 'bottom') {
        step = 1;
        ++rowCount;
      } else {
        step = rowCount;
        rowCount *= 2;
      }
      if (this.isInit) {
        this.initFill(this.dataPool, this.startIndex);
      } else {
        var data = this.getData(this.dataPool, this.startIndex, rowCount);
        this.fillCell(data);
        this.animation();
        this.setStartIndex(this.dataPool, this.startIndex, step);
      }
      this.timer = setTimeout(this.reset.bind(this), 1e3 * duration);
    }
  },
  reset: function () {
    this.loop();
  },
  render: function (_data, config) {
    console.log('render')
    const self = this;
    const cfg = this.mergeConfig(config);
    const data = this.data(_data);
    // 设置全局和头部字体样式
    this.container.css({
      fontFamily: `"${cfg.global.fontFamily}"`
    });
    this.container.find(".header").css({
      fontFamily: `"${cfg.header.textStyle.fontFamily}"`
    });
    if (data) {
      this.updateData(data);
      // 如果轮播模式且单页不轮播且不满一页且设置了单页不轮播
      if (!cfg.global.isLoop || cfg.global.animation.singleStop && data.length <= cfg.global.rowCount) {
        this.removeTimer();
        this.isInit = true;
        if (this.dataPool) {
          const data = this.getData(this.dataPool, 0, cfg.global.rowCount);
          this.fillCell(data, !self.isLoop)
        }
      } else { // 轮播状态
        if (this.isInit) {
          this.removeTimer();
          if (this.dataPool) {
            let data = this.getData(this.dataPool, this.startIndex, cfg.global.rowCount);
            this.fillCell(data, !self.isLoop)
          }
          this.loop();
          this.isInit = false;
        }
        this.visibleEventAdd || document.addEventListener("visibilitychange", () => {
          self.visibleTimer && clearTimeout(self.visibleTimer);
          let a = document.visibilityState;
          if(document.visibilityState === 'visible') {
            self.visibleTimer = setTimeout(self.loop.bind(self), 1e3 * self.config.global.animation.duration)
          } else if (document.visibilityState === 'hidden'){
            clearTimeout(self.visibleTimer);
            this.removeTimer();
            this.removeTextTimer();
          }
        })
        this.visibleEventAdd = true;
      }
    }
      
  },
  // resize 重绘
  resize: function (width, height) {
    this.render(null, {
      width,
      height
    })
  },
  // 接收数据
  data: function (data) {
    // 当数据更新时立即更新视图渲染，否则在下次loop时再更新数据
    if(data) {
      if(this.config.global.ifUpdateImd && this._data && !_.isEqual(this._data, data)) {
        this.isInit = true;
        this.startIndex = 0;
        this.initRank();
      }
      this._data = data;
    } 
    return this._data;
  },
  // 配置合并
  mergeConfig: function (config) {
    console.log('mergeConfig')
    if (!config) return this.config;

    var _config = _.cloneDeep(config);
    nextCfg = _.defaultsDeep(config || {}, this.config);
    nextCfg.series = _config.series || this.config.series;
    // 比对配置不一样则重新初始化
    if(!_.isEqual(this.config, nextCfg)) {
      this.config = nextCfg;
      this.isInit = true;
      this.startIndex = 0;
      this.initRank();
    };
    return this.config
  },
  // 样式更新
  updateStyle: function () { },
  // 组件销毁回调
  destroy: function () {
    this.removeTimer();
    this.removeTextTimer();
    this.container.find(".row-content").off();
    this.container.empty();
    this._data = null;
    this.off && this.off();
  }
});

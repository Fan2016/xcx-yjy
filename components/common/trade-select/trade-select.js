// components/common/trade-select/trade-select.js
var app = getApp(), commonJs = require('../../../utils/common'), treeUtil = commonJs.treeUtil,
  ajax = commonJs.ajax, TIMERID;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isAlone: {
      type: Boolean,
      value: false
    },
    site: {
      type: Array,
      value: [0, 0]
    },
    storageSite: {
      type: Boolean,
      value: true
    } 
  },
  /**
   * 组件的初始数据
   */
  data: {
    TradeArray: [], //地区数组
    TradeValue: [], //当前选中的地区
    firstObject: {
      NAME: "全部",
      CODE:"0000",
      ID: "0000",
    }, 
    secondObject:{
      NAME: "全部",
      ID: "1111",
      CODE: "1111"
    },
    aimArea: '全部',
  },

  /**
   * 组件的方法列表
   */
  attached() {
    var timer = 0;
    if (app.option.trade.length) {
      this.getTrade();
    } else {
      TIMERID = setInterval(() => {
        ++timer
        if (app.option.trade.length) {
          this.getTrade();
          clearInterval(TIMERID)
        }
        if (timer > 50) {
          clearInterval(TIMERID)
        }
      }, 500)
    }
  },
  methods: {
    getTrade(location = {}) {//不空的时候是每个组件传值，自己传值
      let option = app.option,
        trade = new commonJs.treeUtil([...option.trade], 'ID', 'PID'),
        tradeTree = trade.toTree()
      var allTrade = [{
        NAME: "全部",
        ID:"0000",
        CODE: "0000",
        children: []
      }];
      var allType = [{
        NAME: "全部",
        ID: "1111",
        CODE: "1111"
      }];
      var location = wx.getStorageSync('tradeSelect'), site =this.data.site;
      if (this.data.storageSite&&location.site) {
        site = location.site;
      }
      var first = [...allTrade, ...tradeTree];
      var second = [...allType, ...first[site[0]].children];
      var aimArea = (site[0] == 0 && site[1] == 0) ? '全部' : second[site[1]].NAME == '全部' ? first[site[0]].NAME : second[site[1]].NAME;
      this.setData({
        tradeArray: [first, second],
        tradeValue: [site[0], site[1]],
        firstObject: first[site[0]], //默认第一个省份
        secondObject: second[site[1]], //默认第一个省份的第一个市
        aimArea: aimArea.length > 4 ? aimArea.substring(0, 1) + '...' + aimArea.substring(aimArea.length - 1) : aimArea
      })
    },
    bindTradeChange: function (e) {
      console.log('行业选择改变，携带值为', e.detail.value)
      var targetVal = e.detail.value, aryData = this.data.tradeArray,
        aimArea = targetVal[1] ? aryData[1][targetVal[1]]['NAME'] : aryData[0][targetVal[0]]['NAME'];
      this.setData({
        firstObject: this.data.tradeArray[0][e.detail.value[0]],
        secondObject: this.data.tradeArray[1][e.detail.value[1]],
        aimArea: aimArea.length > 4 ? aimArea.substring(0, 1) + '...' + aimArea.substring(aimArea.length - 1) : aimArea
      })
      var TRADE_CODE = this.data.secondObject.CODE === "1111" ? this.data.firstObject.CODE == "0000" ? "" : this.data.firstObject.CODE : this.data.secondObject.CODE;
      var _secondObject = this.data.secondObject;
      _secondObject['parentName'] = this.data.firstObject.NAME;
      this.triggerEvent('tradeSelectEvent', {
        TRADE_CODE: TRADE_CODE,
        FIRST: this.data.firstObject,
        SECOND: _secondObject,
        site: targetVal
      })
    },
    bindTradeColumnChange: function (e) {
      var allType = [{
        NAME: "全部",
        CODE: "1111",
        ID: "1111"
      }];
      var data = {
        tradeArray: this.data.tradeArray,
        tradeValue: this.data.tradeValue
      };
      switch (e.detail.column) {
        case 0:
          data.tradeArray[1] = [...allType, ...data.tradeArray[e.detail.column][e.detail.value].children]; //当选择第一级发生改变，第二级的数据也要改变
          data.tradeValue[0] = e.detail.value; //选中的第一级
          data.tradeValue[1] = 0; //当选择第一级发生改变，第二级的数据也要改变并且默认第一个
          break;
        case 1:
          data.tradeValue[1] = e.detail.value; //当选择第二级区发生改变
          break;
      }
      this.setData(data)
    },
    //对应函数这么写就行了
    HAHAAH() {
      var val = e.detail.val,
        SECOND = val.SECOND;
      wx.setStorageSync('tradeSelect', {
        name: SECOND.NAME == '全部' ? SECOND.parentName : SECOND.NAME,
        parent: SECOND.parentName,
        code: val.TRADE_CODE,
        site: val.site
      })
    },
  }
})

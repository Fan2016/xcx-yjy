// components/common/yjy-trade/yjy-trade.js
let app = getApp()
let commonJs = require('../../../utils/common')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tradeObj: {
      type: Object,
      value: {
        name: '',
        value: [],
        detail: []
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tradeTop: [],
    tradeSub: {},
    tradeSubList: [],
    tradeTopVal: '',
    selectTrade: {}, //选中的每个省份的地区
    selectTradeList: {}, //选中的每个省份的地区的列表，判断是否选中
    preView: false, //上一次的数据是否已经处理
  },

  lifetimes: {
    attached() {
      this.getTree();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getTree() {
      let option = app.option,
        trade = new commonJs.treeUtil([...option.trade], 'ID', 'PID'),
        tradeTree = trade.toTree()
      let tradeTop = [],
        selectTrade = {},
        selectTradeList = {},
        tradeSub = {}
      tradeTree.forEach(item => {
        tradeTop.push({
          NAME: item.NAME,
          CODE: item.CODE
        })
        if (item.children.length != 1) {
          tradeSub[item.NAME] = [{
            NAME: '全部',
            PARENTNAME: item.NAME,
            CODE: item.CODE.substring(0, 1) //只传前两位
          }].concat(item.children)
        } else {
          tradeSub[item.NAME] = item.children
        }
      });
      for (var key in tradeSub) {
        selectTrade[key] = [];
        selectTradeList[key] = {}
      }
      this.setData({
        tradeTop: tradeTop,
        tradeSub: tradeSub,
        selectTrade: selectTrade,
        selectTradeList: selectTradeList,
      })
      this.handleData()
      console.log(selectTrade)
    },
    handleData() {
      let {
        tradeTop,
        tradeSub,
        tradeObj
      } = this.data
      let tradeTopVal, PARENTNAME = "";
      if (tradeObj.detail && tradeObj.detail.length > 0) {
        let e = {
          detail: {
            value: tradeObj.detail,
            preDataView: true,
          }
        }
        this.tradeChange(e)
      } else {
        tradeTopVal = '工程建设'
        this.setData({
          tradeTopVal: tradeTopVal,
          tradeSubList: tradeSub[tradeTopVal]
        })
      }
    },
    barChange({
      target
    }) {
      let {
        dataset
      } = target
      let {
        level,
        tradeItem
      } = dataset
      let preDataView = false;
      if (level == '1') {
        this.setData({
          tradeTopVal: tradeItem.NAME,
          tradeSubList: this.data.tradeSub[tradeItem.NAME]
        })
        preDataView = this.data.tradeObj.value.length == 0 ? false : true
        let e = {
          detail: {
            value: this.data.selectTrade[tradeItem.NAME],
            preDataView: preDataView,
          }
        }
        this.tradeChange(e)
      }
    },
    //重置的情况
    reset() {
      this.getTree();
    },
    //确定的情况
    TradeConfirm() {
      let selectTrade = this.data.selectTrade;
      let tradeSub = this.data.tradeSub,
        finalTrade = [];
      for (let key in selectTrade) {
        if (selectTrade[key].length != 0) {
          selectTrade[key].forEach((item, index) => {
            tradeSub[key].forEach((tradeList) => {
              if (tradeList.CODE == item) {
                finalTrade.push({
                  PARENTNAME: tradeSub[key][0].PARENTNAME ? tradeSub[key][0].PARENTNAME : tradeList.NAME, //第一级
                  NAME: tradeList.NAME == "全部" ? tradeList.PARENTNAME : tradeList.NAME, //第二级
                  CODE: tradeList.CODE
                })
              }
            })
          })
        }
      }
      this.triggerEvent('yjy-trade', finalTrade)
    },
    //上一次数据
    preDataView(tradeObj) {
      let {
        tradeSub
      } = this.data
      let tradeTopVal = "",
        PARENTNAME = "";
      tradeObj.forEach((list, index) => {
        if (index == 0) {
          PARENTNAME = list.PARENTNAME
        }
        this.data.selectTrade[list.PARENTNAME].push(list.CODE)
        this.data.selectTradeList[list.PARENTNAME][list.CODE] = true
      })
      tradeTopVal = PARENTNAME
      this.setData({
        tradeTopVal: tradeTopVal,
        tradeSubList: tradeSub[tradeTopVal],
        preView: true,
      })
    },
    //a数组的元素是否在B数组也有
    exitEqual(a,key, b) {
      let teap=0;
      for (let i = 1; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
          if (a[i][key] === b[j]) {
            teap++;
          }
        }
      }
      teap = teap == b.length?true:false;
      return teap;
    },
    //一个省复选框发生改变
    tradeChange(e) {
      let selectTradeList = {},
        selectALL = {},
        isAll = false,
        cancelAll = true,
        selectTrade = [];
      if (e.detail.preDataView) {
        if (!this.data.preView) {
          this.preDataView(e.detail.value);
        }
        selectTrade = [];
        e.detail.value = this.data.selectTrade[this.data.tradeTopVal];
      } else {
        selectTrade = this.data.selectTrade[this.data.tradeTopVal]; //之前的值赋值下
        this.data.selectTrade[this.data.tradeTopVal] = e.detail.value
      }
      e.detail.value.length == 0 ? null : e.detail.value.sort();
      if (e.detail.value.length > 0 && this.data.tradeSubList.length == 1) //说明一级下面只有一个。比如说企业采购的下级还是企业采购
      {
        selectTradeList[e.detail.value[0]] = true;
      } 
      else 
      {
        if (selectTrade.length == 1 && selectTrade[0] == this.data.tradeSubList[0].CODE) //这个一级已经全选过了。取消全部的情况
        {
          cancelAll=this.exitEqual(this.data.tradeSubList, "CODE", e.detail.value)
          if (cancelAll) { //点击取消全部
            selectTradeList = {};
            this.data.selectTrade[this.data.tradeTopVal] = [];
          } else //不是点击取消全部，那么就要把全部不能选中。
          {
            this.data.selectTrade[this.data.tradeTopVal] = [];
            e.detail.value.forEach((item, index) => { //
              if (item.length != 1) //不要把全部选中
              {
                selectTradeList[item] = true;
                this.data.selectTrade[this.data.tradeTopVal].push(item);
              }
            })
          }
        } else {
          if (this.data.tradeSubList.length == e.detail.value.length + 1) //只有全部没有选中，其他二级都被选中
          {
            isAll = this.exitEqual(this.data.tradeSubList, "CODE", e.detail.value)
          }
          e.detail.value.forEach((item, index) => { //这个一级选中的 checked为true
            if (item.length == 1 || this.data.tradeSubList.length == e.detail.value.length + 1 && item === this.data.tradeSubList[index + 1].CODE) //选中的是一级的全部或者是所有的二级都选中，全部也要自动勾选
            {
              item = item.length == 2 ? item : this.data.tradeSubList[0].CODE;
              selectALL = {};
              selectALL[item] = true;
              isAll = true;
              this.data.selectTrade[this.data.tradeTopVal] = [];
              this.data.selectTrade[this.data.tradeTopVal].push(item);
            } else {
              selectTradeList[item] = true;
            }
          })
          if (isAll) {
            selectTradeList = selectALL;
          }
        }
      }
      var str = 'selectTradeList.' + this.data.tradeTopVal
      this.setData({
        [str]: selectTradeList
      })
    },
  }
})
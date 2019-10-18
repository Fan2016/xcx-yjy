var commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageindexTotal: 0,
    isMessage: true, //要不要提示
    isLoad: false, //加载转圈圈要不要
    listMsg: '',
    bidList: [],
    isSel: false,
    zbList: [],
    zbPage: 1,
    zbTotal: 0, //总共几条
    zbTotalPage: 0,
    selParam: {
      or: "PUBLISHED_TIME",
      pageindex: 1,
      pagesize: 10,
      NAME: '',
      in_TYPE_ALL: '',
      AREA_CODE: '',
      OPEN_TIME_START: '',
      OPEN_TIME_END: '',
      CONTROL_PRICE_START: '',
      CONTROL_PRICE_END: '',
      in_status: '',
      PUBLISHED_TIME_START: '',
      PUBLISHED_TIME_END: '',
      method: 'Vip.XCX_MyZaoBiao',
    },
    tradeCountList: [],
    zbTradeCount: [],
    collect: {},
    codeGroup: ['', ''],
    baseTradeCode: '',
    baseCodeGroup: ['', ''],
    isShade: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //项目点击后调用接口说明读过
  ClickBySID(e) {
    let sid = e.detail
    ajax({
      url: '/MyBid/ClickBySID',
      data: {
        source_id: sid,
        cy_type: 2 //招标
      }
    }).then((res) => {
      var res = commonJs.getDefalutResponse(res.data);
      if (!res.result) {
        commonJs.showToast({
          title: res.msg
        });
      } else {
        this.data.bidList.forEach((item) => {
          if (item.SOURCE_ID == sid) {
            item.isView = false;
          }
        })
      }
    })
  },
  tradeSearch(e) {
    let param = e.detail, tradeCount = this.data.tradeCountList, filtTradeType = [];
    tradeCount.forEach(item => {
      if (item.VALUE == param.val) {
        item.isCur = param.flag;
        if (param.flag) filtTradeType.push(item.VALUE);
      }
      else if (item.isCur) {
        filtTradeType.push(item.VALUE)
      }
    })
    let in_TYPE_ALL = filtTradeType.join().length ? filtTradeType.join() : this.data.baseTradeCode
    this.setData({
      ['selParam.in_TYPE_ALL']: in_TYPE_ALL,
      zbList: [],
      isLoad: true,
      zbPage: 1,
      isLoad: true, //加载转圈圈要不要
      listMsg: '数据加载中...',
      isShade: true
    })
    this.getBidList({ check: false, empty: true })
  },
  //获取招标列表
  getBidList({ type = '', isShow = true, check = true, update = true, empty = false } = {}) {
    let selParam = this.data.selParam, selCountParam = {};
    selCountParam = JSON.parse(JSON.stringify(selParam))
    delete selCountParam.pageindex
    delete selCountParam.pagesize
    let that = this;
     let newSelParam = {
        pageindex: that.data.zbPage,
      }
      selCountParam.method = 'Vip.XCX_MyZaoBiao_Count';
    selParam = Object.assign(selParam, newSelParam)
    if (check) {
      selCountParam.BIG_TYPE = this.data.codeGroup[0];
      selCountParam.TYPE = this.data.codeGroup[1];
      ajax({
        url: '/Search/GetData',
        data: selCountParam
      }).then(res => {
        let data = res.data.data.data;
        this.setData({
          tradeCountList: data,
          zbTradeCount: data
        })
      })
    }
    if (update) {
      ajax({
        url: '/Search/GetData',
        data: selParam
      }).then((res) => {
        var res = commonJs.getDefalutResponse(res.data);
        if (res.result) {
          this.setData({ isShade: false })
          var total = Math.ceil(res.data.total / selParam.pagesize);
          res.data.data.forEach((item, index) => {
            item["isView"] = item.MyBid_UPDATE_NUM > 0 ? true : false
            item["componentName"] = "bidProject"
          })
          var bidList = [],
            listMsg = "",
            isLoad = false;
          bidList = [...this.data.zbList, ...res.data.data];
            if (bidList.length == 0) {
              listMsg = '暂无数据';
              isLoad = false; //加载转圈圈要不要
            } else if (this.data.selParam.pageindex >= total) {
              listMsg = '已获取全部数据';
              isLoad = false; //加载转圈圈要不要
            } else {
              isLoad = true; //加载转圈圈要不要
              listMsg = '数据加载中...';
            }
            this.setData({
              listMsg: listMsg,
              isLoad: isLoad,
              bidList: [...bidList],
              zbList: [...bidList],
              zbTotalPage: total,
            })
          if (check) this.setData({ zbTotalPage: res.data.total });
        }
      })
    } else {
      let bidList = [...this.data.zbList],
        listMsg = "",
        isLoad = false;
      if (bidList.length == 0) {
        listMsg = '暂无数据';
        isLoad = false; //加载转圈圈要不要
      } else if (this.data.zbPage >= Math.ceil(this.data.zbTotal / 10)) {
        listMsg = '已获取全部数据';
        isLoad = false; //加载转圈圈要不要
      }
      this.setData({
        listMsg,
        isLoad,
        bidList: bidList,
        tradeCountList: [...this.data.zbTradeCount]
      })
    }

  },
  fetchfiltrate(val) {
    let param = val.detail,
      handleType = param.type,
      isSel = param.isSel,
      selType = param.selType,
      selVal = param.selVal,
      allParam = param.param;
    if (handleType == 'toggle') {
      this.setData({
        isSel: isSel
      })
    } else if (handleType == 'search') {
      let selParam = this.data.selParam,
        newSelParam = {};
      selParam.pageindex = 1;
      if (selType != 'trade') {
        this.setData({
          codeGroup: this.data.baseCodeGroup
        })
      }
      switch (selType) {
        case 'area':
          newSelParam = {
            AREA_CODE: selVal, in_TYPE_ALL: this.data.baseTradeCode
          }
          break;
        case 'trade':
          newSelParam = {
            in_TYPE_ALL: selVal
          }
          let codeGroup = [allParam.NAME == '全部' ? allParam.CODE : allParam.parentCode, allParam.NAME == '全部' ? '' : allParam.CODE]
          this.setData({
            codeGroup,
            baseCodeGroup: codeGroup,
            baseTradeCode: selVal
          })
          break
        case 'time':
          newSelParam = {
            OPEN_TIME_START: selVal.startDate,
            OPEN_TIME__END: selVal.endDate, in_TYPE_ALL: this.data.baseTradeCode
          }
          break
        case 'state':
          newSelParam = {
            in_status: selVal, in_TYPE_ALL: this.data.baseTradeCode
          }
          break
        case 'money':
          newSelParam = {
            CONTROL_PRICE_START: selVal.startMoney,
            CONTROL_PRICE_END: selVal.endMoney, in_TYPE_ALL: this.data.baseTradeCode
          }
          break
      }
      this.setData({
        isSel: isSel,
        zbList: [],
        isLoad: true,
        zbPage: 1,
        listMsg: '数据加载中...',
        isLoad: true, //加载转圈圈要不要
        selParam: Object.assign(selParam, newSelParam)
      })
      this.setData({
        listMsg: '数据加载中...',
        isLoad: true, //加载转圈圈要不要
      })
      this.getBidList();
    }
  },
  onLoad: function (options) {
    this.getBidList();
    this.setData({
      listMsg: '数据加载中...',
      isLoad: true, //加载转圈圈要不要
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let collect = wx.getStorageSync('collect') || {}
    this.setData({ collect: collect })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('Down')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let bidType = this.data.bidType,
      zbTotalPage = this.data.zbTotalPage,
      zbPage = this.data.zbPage;
 if (zbPage < zbTotalPage){
      this.data.zbPage = ++zbPage
    } else {
      return
    }
    this.setData({
      listMsg: '数据加载中...',
      isMessage: true,
      isLoad: true
    })
    setTimeout(() => {
      this.getBidList({ check: false })
    }, 1500)
  },
})
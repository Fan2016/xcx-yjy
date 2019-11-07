var commonJs = require('../../../utils/common'),
  initBase = commonJs.initBase,
  ajax = commonJs.ajax,
  getDefalutResponse = commonJs.getDefalutResponse,
  app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indexmenu: [{
        "NAME": "工程建设",
        "val": "工程建设",
        "CODE": "A",
        "IMG": "../../../images/gcjs.png",
        "url": "../projectSearchList/projectSearchList",
      },
      {
        "NAME": "政府采购",
        "val": "政府采购",
        "CODE": "D",
        "IMG": "../../../images/zfcg.png",
        "url": "../projectSearchList/projectSearchList"
      },
      {
        "NAME": "企业采购",
        "val": "企业采购",
        "CODE": "Q",
        "IMG": "../../../images/qycg.png",
        "url": "../projectSearchList/projectSearchList"
      },
      {
        "NAME": "土地矿业",
        "val": "土地矿业",
        "CODE": "B",
        "IMG": "../../../images/tdky.png",
        "url": "../projectSearchList/projectSearchList"
      },
      {
        "NAME": "国有产权",
        "val": "国有产权",
        "CODE": "C",
        "IMG": "../../../images/gycq.png",
        "url": "../projectSearchList/projectSearchList"
      },
      {
        "NAME": "其他项目",
        "IMG": "../../../images/qt.png",
        "val": "其他",
        "CODE": "Z",
        "url": "../projectSearchList/projectSearchList"
      },
      {
        "NAME": "自助服务",
        "val": "自助服务",
        "IMG": "../../../images/jrfw.png",
        "url": "",
        "tag": '敬请期待',
        'tagImg': '../../../images/icon_tag.png'
      },  
      {
        "NAME": "场地预约",
        "val": "场地预约",
        "IMG": "../../../images/cdyy.png",
        "url": "",
        "tag": '敬请期待',
        'tagImg':'../../../images/icon_tag.png'
      }
    ],
    dealData: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 2000,
    kbList: [],
    kbPage: 1,
    kbTotalPage: 0,
    kbTotal: '',
    sbList: [],
    sbPage: 1,
    sbTotalPage: 0,
    sbTotal: '',
    isMessage: true,
    isLoad: true,
    listMsg: '数据加载',
    bidList: [],
    banner: [],
    bidType: 'kb',
    pageUrl: '/pages/homePage/index/index',
    subNum: '',
    code: '',
    in_TYPE_ALL: '',
    isLogin: false,
    tradeCountList: [],
    kbTradeCount: [],
    sbTradeCount: [],
    isAd: false,
    collect: {},
    kbCheckTradeType: [],
    sbCheckTradeType: [],
    codeGroup: ['', ''],
    baseTradeCode: '',
    baseCodeGroup: ['', ''],
    isShade: false,
    isMeUpdate:false,
  },
  checkboxChange(){
    wx.setStorageSync('isAd', 0)
  },
  adClose() {
    this.setData({
      isAd: false
    })
  },
  tradeSearch(e) {
    let param = e.detail,
      type = this.data.bidType,
      tradeCount = this.data[type + 'TradeCount'],
      filtTradeType = [];
    tradeCount.forEach(item => {
      if (item.VALUE == param.val) {
        item.isCur = param.flag;
        if (param.flag) filtTradeType.push(item.VALUE);
      } else if (item.isCur) {
        filtTradeType.push(item.VALUE)
      }
    })
    let in_TYPE_ALL = filtTradeType.join().length ? filtTradeType.join() : this.data.baseTradeCode
    this.setData({
      [type + 'TradeCount']: tradeCount,
      [type + 'Page']: 1,
      [type + 'List']: [],
      in_TYPE_ALL,
      isShade: true
    })
    this.fetchBidList({
      check: true
    })
  },
  fetchArea(e) {
    var val = e.detail.val,
      city = val.cityObject;
    wx.setStorageSync('location', {
      name: city.NAME == '全部' ? city.parentName : city.NAME,
      parent: city.parentName,
      code: val.AREA_CODE,
      site: val.site
    })
    this.setData({
      code: val.AREA_CODE,
      in_TYPE_ALL: this.data.baseTradeCode,
      codeGroup: this.data.baseCodeGroup
    })
    this.fetchBidList({
      flag: true
    })
    this.getSumData()
  },
  fetchTrade(e) {
    var val = e.detail,
      FIRST = val.FIRST,
      SECOND = val.SECOND,
      codeGroup = [FIRST.NAME == '全部' ? '' : FIRST.CODE, SECOND.NAME == '全部' ? '' : SECOND.CODE];
    wx.setStorageSync('tradeSelect', {
      name: SECOND.NAME == '全部' ? SECOND.parentName : SECOND.NAME,
      parent: SECOND.parentName,
      code: val.TRADE_CODE,
      site: val.site,
      codeGroup: codeGroup
    })
    this.setData({
      in_TYPE_ALL: val.TRADE_CODE,
      codeGroup,
      baseCodeGroup: codeGroup,
      baseTradeCode: val.TRADE_CODE
    })
    this.fetchBidList({
      flag: true
    })
  },
  fetchSearch(e) {
    wx.navigateTo({
      url: '../projectSearchList/projectSearchList?name=' + e.detail.val
    })
  },
  fetchBidList({
    flag = false,
    check = false
  } = {}) {
    var that = this,
      todayTime = commonJs.DateFormat('yyyy-MM-dd'),
      type = that.data.bidType;
    if (flag) {
      this.setData({
        kbList: [],
        sbList: [],
        kbPage: 1,
        sbPage: 1,
        isMessage: true,
        isLoad: true,
        listMsg: '数据加载',
      })
      //今日开标
      ajax({
        url: '/Search/GetData/GetDataHandler.ashx',
        data: {
          method: 'Web.XCX_GetJiaoYiList',
          pageindex: 1,
          pagesize: 10,
          or: 'OPEN_TIME',
          OPEN_TIME_START: todayTime,
          OPEN_TIME_END: todayTime,
          AREA_CODE: this.data.code,
          in_TYPE_ALL: this.data.in_TYPE_ALL,
          order:'asc'
        }
      }).then((res) => {
        var data = [...res.data.data.data],
          total = res.data.data.total,
          totalPage = Math.ceil(total / 10),
          isMessage = false,
          listMsg = '';
        if (data.length) {
          if (totalPage == 1) {
            isMessage = true
            listMsg = '已获取全部数据'
          }
          that.setData({
            kbList: data,
            kbTotalPage: totalPage,
            kbTotal: total
          })
        } else {
          listMsg = '暂无数据';
          isMessage = true;
          that.setData({
            kbList: [],
            kbTotalPage: 1,
            kbTotal: 0
          })
        }
        if (type == 'kb') {
          this.setData({
            bidList: data,
            listMsg: listMsg,
            isMessage: isMessage,
            isLoad: false
          })
        }
      })
      ajax({
        url: '/Search/GetData',
        data: {
          method: 'Web.XCX_GetJiaoYiList_Count',
          OPEN_TIME_START: todayTime,
          OPEN_TIME_END: todayTime,
          AREA_CODE: this.data.code,
          BIG_TYPE: this.data.codeGroup[0],
          TYPE: this.data.codeGroup[1]
        }
      }).then(res => {
        let data = res.data.data.data;
        // if(!data.length) return;
        this.setData({
          kbTradeCount: data
        })
        if (type == 'kb') {
          this.setData({
            tradeCountList: data
          })
        }
      })
      //正在报名
      ajax({
        url: '/Search/GetData/GetDataHandler.ashx',
        data: {
          method: 'Web.XCX_GetJiaoYiList_BaoMin',
          pageindex: 1,
          pagesize: 10,
          or: 'PUBLISHED_TIME',
          // PUBLISHED_TIME_START: todayTime,
          // PUBLISHED_TIME_END: todayTime,
          AREA_CODE: this.data.code,
          in_TYPE_ALL: this.data.in_TYPE_ALL
        }
      }).then((res) => {
        var data = [...res.data.data.data],
          total = res.data.data.total,
          totalPage = Math.ceil(total / 10),
          isMessage = false,
          listMsg = '';
        if (data.length) {
          if (totalPage == 1) {
            isMessage = true
            listMsg = '已获取全部数据'
          }
          that.setData({
            sbList: data,
            sbTotalPage: totalPage,
            sbTotal: total
          })
        } else {
          listMsg = '暂无数据';
          isMessage = true;
          that.setData({
            sbList: [],
            sbTotalPage: 1,
            sbTotal: 0
          })
        }
        if (type == 'sb') {
          this.setData({
            bidList: data,
            listMsg: listMsg,
            isMessage: isMessage,
            isLoad: false
          })
        }
      })
      ajax({
        url: '/Search/GetData',
        data: {
          method: 'Web.XCX_GetJiaoYiList_BaoMin_Count',
          AREA_CODE: this.data.code,
          BIG_TYPE: this.data.codeGroup[0],
          TYPE: this.data.codeGroup[1]
        }
      }).then(res => {
        let data = res.data.data.data;
        this.setData({
          sbTradeCount: data
        })
        if (type == 'sb') {
          this.setData({
            tradeCountList: data
          })
        }
      })
    } else {
      let initData = [],
        bidType = {
          kb: 'kbList',
          kbTotal: 'kbTotalPage',
          sb: 'sbList',
          sbTotal: 'sbTotalPage'
        },
        param;
      if (type == 'kb') {
        param = {
          method: 'Web.XCX_GetJiaoYiList',
          pageindex: that.data.kbPage,
          pagesize: 10,
          or: 'OPEN_TIME',
          OPEN_TIME_START: todayTime,
          OPEN_TIME_END: todayTime,
          order:'asc'
        }
        initData = [...that.data.kbList];
      } else {
        param = {
          method: 'Web.XCX_GetJiaoYiList_BaoMin',
          pageindex: that.data.sbPage,
          pagesize: 10,
          or: 'PUBLISHED_TIME',
          // PUBLISHED_TIME_START: todayTime,
          // PUBLISHED_TIME_END: todayTime
        }
        initData = that.data.sbList;
      }
      param.AREA_CODE = this.data.code;
      param.in_TYPE_ALL = this.data.in_TYPE_ALL
      ajax({
        url: '/Search/GetData/GetDataHandler.ashx',
        data: param
      }).then((res) => {
        this.setData({
          isShade: false
        })
        var data = [...initData, ...res.data.data.data],
          total = Math.ceil(res.data.data.total / 10)
        if (data.length) {
          let isMessage = false,
            listMsg = '';
          if (total == 1) {
            isMessage = true
            listMsg = '已获取全部数据'
          }
          that.setData({
            [bidType[type]]: data,
            bidList: [...data],
            [bidType[type + 'Total']]: total,
            isMessage: isMessage,
            isLoad: false,
            listMsg: listMsg
          })
        } else {
          this.setData({
            [bidType[type + 'Total']]: 0,
            bidList: [],
            listMsg: '暂无数据',
            isMessage: true,
            isLoad: false
          })
        }
      })
    }

  },
  cutBidType(e) {
    var val = e.currentTarget.dataset.type,
      bidType = {
        kb: 'kbList',
        sb: 'sbList'
      }
    if (val == this.data.bidType) {
      return
    };
    if (val == 'kb') {
      this.setData({
        tradeCountList: this.data.kbTradeCount
      })
    } else {
      this.setData({
        tradeCountList: this.data.sbTradeCount
      })
    }
    this.setData({
      bidType: val,
      isLoding: false,
      isMessage: false,
    })
    if (!this.data[bidType[val]].length) {
      this.fetchBidList()
    } else {
      this.setData({
        bidList: [...this.data[bidType[val]]]
      })
    };
  },
  getSumData() {
    ajax({ //获取交易汇总
      url: '/Search/GetData/GetDataHandler.ashx',
      data: {
        method: 'Web.XCX_GetCountAmount',
        AREA_CODE: this.data.code
      }
    }).then((res) => {
      var data = res.data.data.data
      this.setData({
        dealData: data
      })
    })
  },
  getBanner() {
    ajax({ //轮播图
      url: '/Search/GetData/GetDataHandler.ashx',
      data: {
        method: 'Web.GetNewsList',
        in_type: '0d081bb7-c771-4b8b-8c3d-53f0d9c7d419',
        pageindex: 1,
        pagesize: 5
      }
    }).then((res) => {
      var data = res.data.data.data
      data.forEach(item => {
        item.IMG_URL = item.IMG_URL + '?timestamp=' + Math.random()
      })
      let indicatorDots = data.length>1?true:false;
      this.setData({
        banner: data,
        indicatorDots
      })
    })
  },
  getMeState(){
    let  pro = [];
    pro.push(new Promise(function (resolve, reject) {
      ajax({
        url: '/Search/GetData?method=Vip.FOLLOW_GetNewTotalNum'
      }).then((res) => {
        let state=res.data.data.data[0].NEWNUM > 0 ? true : false
        resolve(state)
      })
    }))
    pro.push(new Promise(function (resolve, reject) {
      ajax({
        url: '/Search/GetData',
        data: {
          method: 'Vip.MyBid_GetNewTotalNumTBZB'
        }
      }).then((res) => {
        let data = res.data.data.data,state=false;
        data.forEach(item => {
          if (item.NEWNUM>0){
            state=true
          }
        })
        resolve(state)
      })    
    }))
    pro.push(new Promise(function (resolve, reject) {
      ajax({
        url: '/Search/GetData',
        data: {
          method: 'Vip.XCX_GetNewMyMsgCount'
        }
      }).then((res) => {
        let data = res.data.data.data, state = false;
        state = data[0].NUM>0?true:false;
        resolve(state)
      })
    }))
    Promise.all(pro).then((res) => {
      let isMeUpdate=false
      res.forEach(item=>{
        if(item){
          isMeUpdate=true
        }
      })
      this.setData({ isMeUpdate})
    })
  },
  getIndexData() {
    app.indexIsUpdate = false
    this.setData({
      isLogin: app.userName ? true : false
    })
    if(app.userName){
      this.getMeState()
    }
    ajax({
      url: '/Search/GetData?method=Vip.PUSH_GetPushCount'
    }).then((res) => {
      if (res.data.status == '200') {
        var num = res.data.data.data[0].NUM
        if (num) {
          wx.setStorageSync('subNum', num)
        }
      }
      this.setData({
        subNum: wx.getStorageSync('subNum')
      })
    })
    this.getSumData()
    this.fetchBidList({
      flag: true
    })
  },
  bannerSkip(e){//轮播图跳转
    let type = e.currentTarget.dataset.type, sources = e.currentTarget.dataset.sources;
    switch(true){
      case (type == 1): //详情页跳转
        wx.navigateTo({
          url: sources
        });
      break;
      case (type == 2): //外页跳转
        wx.navigateTo({
          url: '../../common/webUrl?url=' + sources
        });
      break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideTabBar({})
    var location = wx.getStorageSync('location'),
      tradeSelect = wx.getStorageSync('tradeSelect');

    this.getBanner()
    this.setData({
      code: location.code,
      in_TYPE_ALL: tradeSelect.code,
      codeGroup: tradeSelect.codeGroup || ['', ''],
      baseCodeGroup: tradeSelect.codeGroup || ['', ''],
      baseTradeCode: tradeSelect.code
    })
    let isAd = wx.getStorageSync('isAd')
    console.log(`isAd-onLoad:${isAd}`)
    if (isAd === 0 || isAd === 1){
      this.setData({
        isAd: isAd == 1 ? true : false
      })
      wx.setStorageSync('isAd', isAd)
    }else{
      this.setData({
        isAd: true
      })
      wx.setStorageSync('isAd', 1)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    let collect = wx.getStorageSync('collect') || {}
    this.setData({
      collect
    })
    if (app.indexIsUpdate) {
      this.setData({
        in_TYPE_ALL: this.data.baseTradeCode,
        codeGroup: this.data.baseCodeGroup
      })
      if (!app.sessionid) {
        initBase().then((res) => {
          this.getIndexData()
        })
      } else {
        this.getIndexData()
      }
    } 
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.indexIsUpdate = true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('Down')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var bidType = this.data.bidType,
      kbTotalPage = this.data.kbTotalPage,
      sbTotalPage = this.data.sbTotalPage,
      kbPage = this.data.kbPage,
      sbPage = this.data.sbPage,
      isMessage = this.data.isMessage;

    if (bidType == 'kb' && (kbPage < kbTotalPage) && !isMessage) {
      this.data.kbPage = ++kbPage
      console.log(this.data.kbPage && !isMessage)
    } else if (bidType == 'sb' && (sbPage < sbTotalPage)) {
      this.data.sbPage = ++sbPage
    } else if ((!(kbPage < kbTotalPage) || !(sbPage < sbTotalPage)) && !isMessage) {
      this.setData({
        listMsg: '已获取全部数据',
        isMessage: true,
        isLoad: false
      })
      return
    } else {
      return
    }

    this.setData({
      listMsg: '数据加载中...',
      isMessage: true,
      isLoad: true
    })
    setTimeout(() => {
      this.fetchBidList()
    }, 1500)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
var app = getApp(),
  commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax,
  initBase = commonJs.initBase,
  DateFormat = commonJs.DateFormat
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageindex: 1,
    pageindexTotal: 0,
    total: 0,
    NAME: "", //搜索
    isMessage: true, //要不要提示
    isLoad: true, //加载转圈圈要不要
    listMsg: '订阅数据加载',
    bidList: [],
    isLogin: false, //是否登录
    pageUrl: '/pages/subscription/index/index',
    subSet: [],
    pushList: [],
    isCondition: false,
    sspConf: {
      region: [],
      category: [],
      price: ''
    },
    tmList: [],
    isUpdate: true,
    collect:{},
    isMeUpdate:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //订阅设置
  setConfig() {
    // this.setData({
    //   isConfig: true
    // })
    wx.navigateTo({
      url: './configPage/configPage'
    })

  },
  tradeClick(e){
    let { strTraceCount, flag, strData, filtListData}=e.detail
    this.setData({
      [strTraceCount]: flag,
      [strData]: filtListData
    })
  },
  conditionEvent() {
    if (!this.data.isCondition) {
      ajax({
        url: '/Search/GetData?method=Vip.XCX_GetDinYue'
      }).then((data) => {
        var data = data.data
        let {
          status,
          msg
        } = data
        if (status === '200') {
          if (data && data.data && data.data.data && data.data.data[0]) {
            let config = JSON.parse(data.data.data[0].CONFIG)
            this.setData({
              'sspConf.region': config.region.name == "" ? ["不限"] : config.region.name.split(","),
              'sspConf.category': config.category.name == "" ? ["不限"] : config.category.name.split(","),
              'sspConf.price': config.price.name || "不限",
              isCondition: !this.data.isCondition
            })
          }
        }
      })
    } else {
      this.setData({
        isCondition: !this.data.isCondition
      })
    }
  },
  cancelView(e) {
    var site = e.detail.site,
      index = e.detail.index,
      bidList = [...this.data.bidList];
    var str = 'bidList[' + site + '].data[' + index + '].isView'
    this.setData({
      [str]: false
    })
  },
  //获取订阅设置
  getConfig(val) {
    var param = val.detail;
    var selParam = this.data.param; //原本的参数
    var newParam = {
      pageindex: 1,
      TYPE_ALL: '',
      AREA_CODE: '',
      CONTROL_PRICE_START: '',
      CONTROL_PRICE_END: '',
      OPEN_TIME_START: '',
      OPEN_TIME_END: '',
    };
    var curDate = new Date();
    if (param.time.value != "") {
      newParam.OPEN_TIME_START = DateFormat("yyyy-MM-dd");
      newParam.OPEN_TIME_END = DateFormat("yyyy-MM-dd", new Date(curDate.setDate(curDate.getDate() + Number(param.time.value))));
    }
    newParam.TYPE_ALL = param.category.value;
    newParam.CONTROL_PRICE_START = param.price.value.split(",")[0] || "";
    newParam.CONTROL_PRICE_END = param.price.value.split(",")[1] || "";
    newParam.AREA_CODE = param.region.value
    this.setData({
      isConfig: false,
      param: Object.assign(selParam, newParam)
    })
    this.getBidList(true);
  },
  //搜索框
  fetchSearch(e) {
    var val = e.detail.val;
    this.data.param.NAME = val || ""
    this.data.param.pageindex = 1
    if (this.data.isLogin) {
      this.getBidList(true);
    }
  },
  //获取订阅列表
  getBidList() {
    var start = (this.data.pageindex - 1) * 2,
      add = [...this.data.tmList].splice(start, 2),
      bidList = this.data.bidList;
    this.setData({
      bidList: [...bidList, ...add]
    })
  },
  getPushList() {
    this.setData({
      listMsg: '订阅数据加载',
      isLoad: true,
      bidList: []
    })
    // wx.setStorageSync('pushList', [])//临时
    // wx.setStorageSync('viewPush', {})
    ajax({
      url: '/Search/GetData?method=Vip.PUSH_GetPushList',
    }).then((res) => {
      var res = commonJs.getDefalutResponse(res.data);
      if (res.result) {
        var data = [],
          initPush = wx.getStorageSync('pushList') || [],
          pushList = [],
          listMsg = '',
          isMessage = false,
          viewPush = wx.getStorageSync('viewPush'),
          newData = res.data.data.reverse();
        if (!viewPush) {
          wx.setStorageSync('viewPush', {})
          viewPush = {}
        }
        newData.forEach(item => {
          let obj = JSON.parse(item.MSG)
          obj.CREATE_TIME = item.CREATE_TIME.substr(0, 10)
          data.push(obj)
        })
        if (data.length) {
          pushList = [...data, ...initPush].splice(0, 500) //限存500
          wx.setStorageSync('pushList', [...pushList])
        } else {
          pushList = [...initPush]
        }
        if (pushList.length < 10) {
          listMsg = '已加载所有订阅数据'
          isMessage = true
        }
        if (pushList.length == 0) {
          listMsg = '暂无订阅数据'
          isMessage = true
        }
        pushList.forEach(item => {
          item.isView = viewPush[item.ID] ? false : true
        })
        var tmList = [],
          tmStage = {};
        pushList.forEach(item => {
          if (!tmStage[item.CREATE_TIME]) {
            tmStage[item.CREATE_TIME] = [item]
          } else {
            tmStage[item.CREATE_TIME].push(item)
          }
        })
        Object.keys(tmStage).forEach(item => {
          tmList.push({
            tm: item,
            data: tmStage[item],
            dataInit: tmStage[item],
            date: this.timeChange(item)
          })
        })
        tmList = tmList.splice(0, 7) //显示近7天数据
        tmList.forEach(item => {
          let traceCount=this.tradeClass(item.data);
          item.traceCount = traceCount;
        })
        this.setData({
          pageindex: 1,
          pushList: [...pushList],
          total: [...pushList].length,
          pageindexTotal: Math.ceil(tmList.length / 7),
          bidList: [...tmList],
          isLoad: false,
          listMsg,
          isMessage,
          tmList
        })
      }
    })
  },
  onLoad: function(options) {
    wx.hideTabBar({})
    this.setData({
      isUpdate: false
    })
    // this.getHasLogin();
    if (!app.sessionid) {
      initBase().then((res) => {
        this.init()
      })
    } else {
      this.init()
    }


  },
  timeChange(val) {
    var str1;
    str1 = val.split("-");
    return str1[0] + '年' + str1[1] + '月' + str1[2] + '日'
  },
  tradeClass(abc) {
    var data = [{
          "VALUE": "A",
          "SHORT_NAME": "工程",
          "COLOR": "#abdbff",
          "COUNT": 0
        },
        {
          "VALUE": "D",
          "SHORT_NAME": "政采",
          "COLOR": "#ffc4ac",
          "COUNT": 0
        },
        {
          "VALUE": "B",
          "SHORT_NAME": "土地",
          "COLOR": "#ffdfb6",
          "COUNT": 0
        },
        {
          "VALUE": "C",
          "SHORT_NAME": "产权",
          "COLOR": "#c8cbff",
          "COUNT": 0
        },
        {
          "VALUE": "Z",
          "SHORT_NAME": "其他",
          "COLOR": "#abeaab",
          "COUNT": 0
        },
        {
          "VALUE": "Q",
          "SHORT_NAME": "企采",
          "COLOR": "#ffc4c5",
          "COUNT": 0
        }
      ],
      site = { "工程": 0, "政采": 1, "土地": 2, "产权": 3, "其他": 4, "企采":5};
    abc.forEach(item=>{
      var key =site[item.SHORT_NAME];
      data[key].COUNT++
    })
    return data
  },
  getHasLogin() {
    var listMsg = '',
      isLogin = false,
      isMessage = false;
    if (app.userName) {
      isLogin = true
      isMessage = true
      listMsg = '订阅数据加载'
    } else {
      listMsg = '暂无订阅数据'
      isMessage = true
    }
    this.setData({
      listMsg: listMsg,
      isMessage: isMessage,
      isLogin: isLogin
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  init() {
    this.getHasLogin();
    if (!this.data.isLogin) {
      commonJs.unLoginToast();
    } else {
      this.getMeState()
      ajax({
        url: '/Search/GetData?method=Vip.XCX_GetDinYue'
      }).then((data) => {
        var data = data.data
        let {
          status,
          msg
        } = data
        if (status === '200') {
          if (data && data.data && data.data.data && data.data.data[0]) {
            let config = JSON.parse(data.data.data[0].CONFIG),
              IS_REMOVE = data.data.data[0].IS_REMOVE
            this.setData({
              'sspConf.region': config.region.name == "" ? ["不限"] : config.region.name.split(","),
              'sspConf.category': config.category.name == "" ? ["不限"] : config.category.name.split(","),
              'sspConf.price': config.price.name || "不限"
            })
            if (IS_REMOVE == 1) {
              wx.setStorageSync('pushList', [])
              ajax({
                url: '/User/ResetSubscribeRemove' //清除订阅更新标识IS_REMOVE=0
              }).then((data) => {})
            }
            this.getPushList()
          } else {
            this.getPushList()
          }
        }
        
      })
    }
  },
  getMeState() {//我的模块是否更新
    let pro = [];
    pro.push(new Promise(function (resolve, reject) {
      ajax({
        url: '/Search/GetData?method=Vip.FOLLOW_GetNewTotalNum'
      }).then((res) => {
        let state = res.data.data.data[0].NEWNUM > 0 ? true : false
        resolve(state)
      })
    }))
    pro.push(new Promise(function (resolve, reject) {
      ajax({
        url: '/Search/GetData?method=Vip.MyBid_GetNewTotalNum'
      }).then((res) => {
        let state = res.data.data.data[0].NEWNUM > 0 ? true : false
        resolve(state)
      })
    }))
    Promise.all(pro).then((res) => {
      let isMeUpdate = false
      res.forEach(item => {
        if (item) {
          isMeUpdate = true
        }
      })
      this.setData({ isMeUpdate })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    // if (this.data.update){ //是否更新订阅
    // }
    let isLogin = app.userName ? true : false
    this.setData({
      isLogin
    })
    wx.hideTabBar({})
    let collect = wx.getStorageSync('collect') || {}
    this.setData({ collect: collect })
    var subNum = wx.getStorageSync('subNum')
    if (subNum && this.data.isUpdate) {
      // this.getHasLogin();
      if (!app.sessionid) {
        initBase().then((res) => {
          this.init()
        })
      } else {
        this.init()
      }
    }
    wx.setStorageSync('subNum', '')
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      isUpdate: true
    })
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
    return
    var pageindex = this.data.pageindex,
      pageindexTotal = this.data.pageindexTotal;
    if ((pageindex < pageindexTotal)) {
      this.data.pageindex = ++pageindex
    } else if (pageindex >= pageindexTotal) {
      this.setData({
        listMsg: '已加载所有订阅数据',
        isMessage: true
      })
      return
    }
    this.getBidList()
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
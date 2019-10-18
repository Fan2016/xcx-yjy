// pages/projectDetail/projectDetail.js
var commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax,
  app = getApp(),
  DateFormat = commonJs.DateFormat,
  initBase = commonJs.initBase,
  showToast = commonJs.showToast,
  TIMERID, k = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    bidName: '',
    bidSHORT_NAME: '', //简写
    bidState: '',
    viewType: 'flow',
    unfold: '0',
    flowList: [],
    dayTen: "0",
    day: "0",
    hourTen: "0",
    hour: "0",
    minuteTen: "0",
    minute: "0",
    secondTen: "0",
    second: "0",
    OpeningTime: "",
    ServerTime: "",
    curToggle: true,
    isCollect: false,
    top: '',
    H: '100%',
    onLoad: false, //onload是否已经执行
    oldBid: false,
    oldUrl: '',
    oldUrlText: '',
    isShowUrl: false,
    indexIsUpdate: true,
    urlParam: {},
    toView:'',
    isVideo:false,
    urlVideo:[],
    isDBD:false,
    dbdData:'',
    videoId:'',
    isIos:false,
    remind:false,
    CREATE_BY:''
  },
  fetchVideo(id){
    ajax({
      host:'https://vm.enjoy5191.com',
      url: '/MultipleVideo/GetLiveUrl',
      data: {
        Bid: id
      }
    }).then((res) => {
      let { code, data, status } = res.data, isVideo=false;
      if(code==1&&data.length>0){
        isVideo=true
      }   
      this.setData({ urlVideo: data, isVideo})
    })
  },
  skipVideo(){
    // let urlVideo = this.data.urlVideo, 
    // url = urlVideo[0][0].replace(/http/g, "https"), 
    // url2 = urlVideo[1][0].replace(/http/g, "https"),
    // name=this.data.bidName;
    // let id = this.data.id, bidName=this.data.bidName,isDBD=this.data.isDBD,dbdData=this.data.dbdData;
    let { id, bidName, isDBD, dbdData, videoId, isIos, CREATE_BY=''}=this.data;
  
    wx.navigateTo({
      url: '../video/video?id=' + id + '&title=' + bidName.substring(0,30) + '&isDBD=' + isDBD + '&dbdData=' + dbdData + '&videoId=' + videoId + '&isIos=' + isIos + '&CREATE_BY=' + CREATE_BY
    })
  },
  timeChange(val) {
    var str1, str2;
    str1 = val.split(" ");
    str2 = str1[0].split("-");
    return str2[0] + '年' + str2[1] + '月' + str2[2] + '日' + ' ' + str1[1]
  },
  cutViewType(e) {
    var val = e.currentTarget.dataset.type
    this.setData({
      viewType: val
    })
  },
  pointTo(e) {
    let unfold = e.currentTarget.dataset.unfold;
    this.setData({
      viewType: 'info',
      unfold,
      curToggle: true,
      toView: 'arrow' + unfold
    })
    wx.nextTick(()=>{
      this.setData({
        toView: 'arrow' + unfold
      })
    })

  },
  infoShow(e) {
    let curToggle, unfold = e.currentTarget.dataset.unfold;
    if (this.data.unfold == unfold) {
      curToggle = !this.data.curToggle
    } else {
      curToggle = true
    }
    this.setData({
      unfold,
      curToggle: curToggle,
      // toView: 'arrow' + unfold
      // top: 0
    })
    if (curToggle){
      wx.nextTick(() => {
        this.setData({ toView: 'arrow' + unfold })
      })
    }    
  },
  showTime(OpeningTime, ServerTime) {
    k++
    var _STime = new Date(ServerTime.substr(0, 10) + "T" + ServerTime.substr(11, 8)).getTime();
    var _OTime = new Date(OpeningTime.substr(0, 10) + "T" + OpeningTime.substr(11, 8)).getTime();
    var time_distance = _OTime - _STime - k * 1000;
    var int_day, int_hour, int_minute, int_second;
    if (time_distance > 0) {
      int_day = Math.floor(time_distance / 86400000);
      time_distance -= int_day * 86400000;
      int_hour = Math.floor(time_distance / 3600000);
      time_distance -= int_hour * 3600000;
      int_minute = Math.floor(time_distance / 60000);
      time_distance -= int_minute * 60000;
      int_second = Math.floor(time_distance / 1000);
      this.setData({
        dayTen: parseInt(int_day / 10),
        day: parseInt(int_day % 10),
        hourTen: parseInt(int_hour / 10),
        hour: parseInt(int_hour % 10),
        secondTen: parseInt(int_second / 10),
        second: parseInt(int_second % 10),
        minuteTen: parseInt(int_minute / 10),
        minute: parseInt(int_minute % 10)
      })
      var that = this;
      TIMERID = setTimeout(function() {
        that.showTime(that.data.OpeningTime, that.data.ServerTime)
      }, 1000);
    } else {
      this.setData({
        dayTen: 0,
        day: 0,
        hourTen: 0,
        hour: 0,
        secondTen: 0,
        second: 0,
        minuteTen: 0,
        minute: 0
      })
      clearTimeout(TIMERID);
      this.setData({
        bidState: '已开标'
      })
    }
  },
  collect() {
    if (!app.userName) {
      wx.showModal({
        title: '提示:',
        content: '请前往绑定手机号后使用该功能',
        confirmText: "绑定",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../user/login/login'
            })
          } else if (res.cancel) {}
        }
      })
      return
    }
    let id = this.data.id,
      collect = wx.getStorageSync('collect');
    if (this.data.isCollect) { //取消关注

      ajax({
        url: '/Focus/CancelFocus',
        data: {
          SOURCE_ID: id
        }
      }).then((res) => {
        if (res.data.status == 200) {
          collect[id] = 0
          wx.setStorageSync('collect', collect)
          this.setData({
            isCollect: false
          })
          showToast({
            title: res.data.msg
          })
        } else {
          showToast({
            title: res.data.msg,
            image: '../../../images/warn.png'
          })
        }
      })
    } else {
      ajax({
        url: '/Focus/Focus',
        data: {
          SOURCE_ID: id
        }
      }).then((res) => {
        if (res.data.status == 200) {
          collect[id] = 1
          wx.setStorageSync('collect', collect)
          this.setData({
            isCollect: true
          })
          showToast({
            title: res.data.msg
          })
        } else {
          showToast({
            title: res.data.msg,
            image: '../../../images/warn.png'
          })
        }
      })
    }
    let outParam = Object.assign({}, this.data.urlParam);
    if (outParam.cancel == 'true') {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      outParam.cancel=this.data.isCollect
      if (prevPage) {
        prevPage.setData({
          outParam
        })
      }
    }
  },
  skipIndex() {
    wx.switchTab({
      url: '/pages/homePage/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.indexIsUpdate == 'false' || !options.indexIsUpdate) {
      this.setData({
        indexIsUpdate: false
      })
    } else {
      this.setData({
        indexIsUpdate: true
      })
    }
    var that = this;
    k = 0;
    this.setData({
      id: options.id || '', // '5c19e19ea6e3251694491927'
      onLoad: true,
      urlParam: options || {}
    })
    wx.getSystemInfo({
      success: function(res) {
        if (res.system.indexOf('iOS') > -1) {
          that.setData({
            H: res.windowHeight - 70 + "px",
            isIos:true
          })
        }
      }
    })
    if (!app.sessionid) {
      initBase().then((res) => {
        this.init()
      })
    } else {
      this.init()
    }
  },
  getUrlParms(url) {
    if (!url) {
      return ''
    }
    var _url = url.substr(url.indexOf('?') + 1);
    var addres = url.substring(0, url.indexOf('?'))
    var args = new Object();
    var query = decodeURI(_url);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('=');
      if (pos == -1) continue;
      var argname = pairs[i].substring(0, pos);
      var value = pairs[i].substring(pos + 1);
      args[argname] = decodeURI(value);
    }
    args['addres'] = addres;
    return args;
  },
  init() {
    var id = this.data.id
    if (!id) return;
    ajax({
      url: '/Search/GetData?method=Web.XCX_GetJiaoYiDetail',
      data: {
        SOURCE_ID: id
      }
    }).then((res) => {
      var data = res.data.data.data[0];
      var oldUrl = this.getUrlParms(data.URL_SHOW)
      let curTime = new Date().getTime(), openTime = new Date(data.OPEN_TIME.replace(/-/g, '/')).getTime();
      let IS_ALL_FLOW = false, videoId = data.VIDEO_ID, isHallPass = false, STATUS_TXT = data.STATUS_TXT;
      if (data.IS_ALL_FLOW == 1 && STATUS_TXT != '终止招标' && STATUS_TXT != '流标') isHallPass = true//IS_ALL_FLOW == 1为全流程
      if (((curTime > openTime) || (openTime - curTime <= 3600000)) && app.userName && isHallPass){//开标前一小时内
        ajax({
          url: '/OpenHall/GetSection',
          data: {
            SOURCE_ID: id
          }
        }).then((res) => {
          let data = res.data.data; 
          if (!data) return;
          this.setData({ isDBD: data.IsDBD, dbdData: JSON.stringify(data.bIds), isVideo: data.bIds.length ? true : false, videoId})
        })
      }
      this.setData({
        bidName: data.NAME,
        bidSHORT_NAME: data.BIG_TYPE_TEXT,
        bidState: data.STATUS_TXT,
        bidPublishTime: this.timeChange(data.PUBLISHED_TIME),
        OpeningTime: this.timeChange(data.OPEN_TIME),
        oldBid: data.IS_NEW == 0 ? true : false,
        oldUrl: JSON.stringify(oldUrl),
        isShowUrl: data.IS_SHOW_URL == 0 ? false : true,
        oldUrlText: data.URL,
        CREATE_BY: data.CREATE_BY||''
      })
      // ajax({
      //   url: '/Search/GetData?method=Web.XCX_GetDBTime'
      // }).then((res) => {
      //   var serverTime = res.data.data.data[0].TM;
      //   this.setData({
      //     ServerTime: serverTime
      //   })
      //   var _STime = new Date(serverTime.substr(0, 10) + "T" + serverTime.substr(11, 8)).getTime();
      //   var _OTime = new Date(data.OPEN_TIME.substr(0, 10) + "T" + data.OPEN_TIME.substr(11, 8)).getTime();
      //   // if (_OTime > _STime) {//倒计时
      //   //   this.showTime(data.OPEN_TIME, serverTime)
      //   // }
      // })
    })
    ajax({
      url: '/Search/GetData?method=Web.XCX_GetTimeLine',
      data: {
        SOURCE_ID: id
      }
    }).then((res) => {
      var data = res.data.data.data,
        flowList = [];
      data.forEach((item) => {
        item.timeA = item.TM.split(" ")[0]
        item.timeB = item.TM.split(" ")[1].substr(0, 5); //取值到分
        flowList.push(item)
      })
      this.setData({
        flowList: flowList
      })
    })
    ajax({
      url: '/Search/GetData?method=Vip.XCX_GetFocus',
      data: {
        SOURCE_ID: id
      }
    }).then((res) => {
      var isCollect = false;
      if (res.data.status == 200) {
        if (res.data.data.data.length) isCollect = true;
      } else {
        isCollect = false
      }
      if (app.userName) {
        let collect = wx.getStorageSync('collect') || {}
        collect[id] = isCollect ? 1 : 0;
        wx.setStorageSync('collect', collect)
      }
      this.setData({
        isCollect: isCollect
      })
    })
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
    // let pages = getCurrentPages()
    // let prevPage=pages[pages.length-2]
    // if (prevPage){
    //       prevPage.setData({
    //   solo:911
    // })
    // }


    // Test--End
    app.indexIsUpdate = this.data.indexIsUpdate;
    if (!this.data.onLoad) { //onLoad执行好了就不要再执行
      // k = 0;
      // ajax({
      //   url: '/Search/GetData?method=Web.XCX_GetDBTime'
      // }).then((res) => {
      //   var serverTime = res.data.data.data[0].TM;
      //   this.setData({
      //     ServerTime: serverTime
      //   })
      //   var _STime = new Date(serverTime.substr(0, 10) + "T" + serverTime.substr(11, 8)).getTime();
      //   var _OTime = new Date(this.data.OpeningTime.substr(0, 10) + "T" + this.data.OpeningTime.substr(11, 8)).getTime();
      //   if (_OTime > _STime) {
      //     this.showTime(this.data.OpeningTime, serverTime)
      //   }
      // })

    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // k = 0;
    // this.setData({
    //   dayTen: 0,
    //   day: 0,
    //   hourTen: 0,
    //   hour: 0,
    //   secondTen: 0,
    //   second: 0,
    //   minuteTen: 0,
    //   minute: 0,
    //   onLoad: false,
    // })
    // clearTimeout(TIMERID);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // this.setData({
    //   dayTen: 0,
    //   day: 0,
    //   hourTen: 0,
    //   hour: 0,
    //   secondTen: 0,
    //   second: 0,
    //   minuteTen: 0,
    //   minute: 0,
    //   onLoad: false,
    // })
    // k = 0;
    // clearTimeout(TIMERID);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: "pages/ebid/projectDetail/projectDetail?id=" + this.data.id + "&indexIsUpdate=true"
    }

  }
})
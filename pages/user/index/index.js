var app = getApp(),
  commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax, initBase = commonJs.initBase;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: "游客",
      avatarUrl: "../../../images/userIcon.png",
    },
    isLogin: false, //是否登陆
    impower: false, //是否微信授权
    userName: '游客',
    pageUrl: '/pages/user/index/demo',
    subNum: '',
    isCareUpdate:0,
    isUpdateTB:0,
    isUpdateZB:0

  },
  onGotUserInfo: function (e) {
    //授权允许
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        userInfo: e.detail.userInfo,
        impower: true,
      })
      app.userInfo = e.detail.userInfo;
      app.impower = true;
    } else { //授权拒绝
      this.setData({
        impower: false,
      })
      app.userInfo = {};
      app.impower = false;
      console.log("拒绝授权")
    }
  },
  //关注是否有更新
  getNewTotalNum() {
    let that = this
    ajax({
      url: '/Search/GetData',
      data: {
        method: 'Vip.FOLLOW_GetNewTotalNum'
      }
    }).then((res) => {
      let isCareUpdate =res.data.data.data[0].NEWNUM;
      this.setData({ isCareUpdate })
    })
  },
  //参与招标、投标是否有更新
  getJoinTotalNum() {
    ajax({
      url: '/Search/GetData',
      data: {
        method: 'Vip.MyBid_GetNewTotalNumTBZB'
      }
    }).then((res) => {
      let data = res.data.data.data
      data.forEach(item=>{
        if (item.CY_TYPE==1){
          this.setData({ isUpdateTB: item.NEWNUM })
        }
        else if (item.CY_TYPE == 2){
          this.setData({ isUpdateZB: item.NEWNUM })
        }
      })
    })
  },
  userBundle() {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  unbundle() {
    var that = this,
      username = this.data.userName;
    wx.showModal({
      title: '提示',
      content: '确定退出此账号？',
      success(res) {
        if (res.confirm) {
          wx.login({ //用户是否注册绑定手机号
            success(res) {
              ajax({
                url: '/Login/LogOut',
                data: {
                  code: res.code,
                  username: username
                }
              }).then((res) => {
                var data = commonJs.getDefalutResponse(res.data)
                if (data.result) {
                  // app.token_type = ''
                  // app.access_token = ''
                  app.userName = ''
                  that.setData({
                    isLogin: false,
                    userName: '游客'
                  })
                  wx.showToast({
                    title: data.msg,
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({})
    this.showUser();
    // this.setData({ subNum: wx.getStorageSync('subNum') }) 
    if (this.data.isLogin) {
      this.getNewTotalNum();
      this.getJoinTotalNum();
    }
  },
  loginTab(e) {
    //../interest/interest
    if (this.data.isLogin) {
      let id = e.currentTarget.dataset.id, skipUrl = e.currentTarget.dataset.url,url='';
      if (id == 'guanzhu' || id == 'toubiao' || id == 'zhaobiao'){
        switch (id) {
          case "guanzhu": url = "/Focus/Click"; break;
          case "toubiao": url = "/MyBid/ClickByTB"; break;
          case "zhaobiao": url = "/MyBid/ClickByZB"; break;
        }
      }
      else{
        wx.navigateTo({
          url: skipUrl
        })
        return
      }
      //点击后调用接口,不再小红点
      ajax({
        url: url,
        data: {}
      }).then((res) => {
        res = commonJs.getDefalutResponse(res.data);
        if (res.result) {
          let type='';
          switch (id) {
            case "guanzhu": type = "isCareUpdate"; break;
            case "toubiao": type = "isUpdateTB"; break;
            case "zhaobiao": type = "isUpdateZB"; break;
          }
          this.setData({
            [type]: 0
          })
        }
        else {
          wx.showToast({
            title: url + "出错",
            icon: 'error',
            duration: 2000
          })
        }
        wx.navigateTo({
          url: skipUrl
        })
      })
    } else {
      commonJs.unLoginToast();
    }
  },
  showUser() //显示授权或者登陆等
  {
    var userInfo = this.data.userInfo;
    var impower = this.data.impower;
    var isLogin =false;
    var userName = app.userName

    //是否授权
    if (impower) {
      userInfo = app.userInfo;
    }
    if (userName) {
      isLogin = true;
    }
    this.setData({
      impower,
      userInfo,
      isLogin,
      userName: userName||'游客',
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
    wx.hideTabBar({})
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
    if (!app.sessionid) {
      initBase().then((res) => {
        this.showUser();
      })
    } else {
      this.showUser();
    }
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

  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
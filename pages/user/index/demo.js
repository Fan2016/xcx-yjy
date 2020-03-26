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
    pageUrl: '/pages/user/index/index',
    subNum: '',
    isCareUpdate:false,
    isJoinUpdate:false
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
      let isCareUpdate = res.data.data.data[0].NEWNUM > 0 ? true : false;
      this.setData({ isCareUpdate })
    })
  },
  //参与是否有更新
  getJoinTotalNum() {
    let that = this
    ajax({
      url: '/Search/GetData',
      data: {
        method: 'Vip.MyBid_GetNewTotalNum'
      }
    }).then((res) => {
      let isJoinUpdate = res.data.data.data[0].NEWNUM > 0 ? true : false;
      this.setData({ isJoinUpdate })
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
      if (id =='guanzhu'||id=='canyu'){
        switch (id) {
          case "guanzhu": url = "/Focus/Click"; break;
          case "canyu": url = "/MyBid/Click"; break;
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
            case "canyu": type = "isJoinUpdate"; break;
          }
          this.setData({
            [type]: false
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
    var isLogin = this.data.isLogin;
    var userName = app.userName || this.data.userName

    //是否授权
    if (app.impower) {
      userInfo = app.userInfo;
    }
    if (app.userName) {
      isLogin = true;
    }
    this.setData({
      impower: app.impower,
      userInfo: userInfo,
      isLogin: isLogin,
      userName: userName,
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
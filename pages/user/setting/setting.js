// pages/user/setting/setting.js
const app = getApp(), commonJs = require('../../../utils/common'),ajax = commonJs.ajax;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    banner:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName:app.userName,
      banner: 'https://vm.enjoy5191.com/images/set-banner.png?temp='+ new Date().getTime()
    })
  },
  unbundle(e){
    let that = this, type = e.currentTarget.dataset.id;
    if (!that.data.userName){
      wx.navigateTo({ url: '../login/login' })
      return
    }
    if (type == 'userToggle') {
      that.userExit(type)
    } else if (type == 'userOut'){
      wx.showModal({
        title: '提示',
        content: '确定退出此账号？',
        success(res) {
          if (res.confirm) {
            that.userExit(type)
          } else if (res.cancel) { }
        }
      })
    }  
  },
  userExit(type){
    let that = this, username = this.data.userName;
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
            app.token_type = ''
            app.access_token = ''
            app.userName = ''
            that.setData({
              userName: ''
            })
            wx.showToast({
              title: data.msg,
              icon: 'success',
              duration: 2000
            })
            if (type =='userToggle'){
              wx.navigateTo({ url:'../login/login'})
            } else if (type == 'userOut'){
              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            }
            
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
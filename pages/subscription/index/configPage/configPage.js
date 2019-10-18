var app = getApp(),
  commonJs = require('../../../../utils/common'),
  ajax = commonJs.ajax
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '订阅设置',
      success: function(res) {
        // success
      }
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
  //获取订阅设置
  getConfig(val,skip) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面 
    prevPage.setData({
      update: true,
    })
    if (val.detail.skip){
      wx.navigateBack({
        delta: 1
      })
    }
  },
 
  /**
    * 生命周期函数--监听页面隐藏
    */
  onShow: function () { 
    let isLogin = app.userName ? true : false
    this.setData({
      isLogin
    })
    if (this.data.sspConf)
    {
      this.selectComponent("#sspConfig").setSspConfView(this.data.sspConf);
    }
    this.selectComponent("#sspConfig").loginState(isLogin)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
 
})
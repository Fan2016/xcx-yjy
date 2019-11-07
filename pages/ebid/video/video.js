// pages/ebid/video/video.js
let app = getApp(), flag=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '',
    options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let videoUrl = "https://vm.enjoy5191.com/xcxvideo.html?" + encodeURIComponent("id=" + options.id + '&title=' + options.title + '&isDBD=' + options.isDBD + '&videoId=' + options.videoId + '&dbdData=' + options.dbdData + "&uid=" + app.userName + "&isIos=" + options.isIos + "&CREATE_BY=" + options.CREATE_BY) + "&timestamp =" + new Date().getTime() + "#" + app.token_type + ' ' + app.access_token;
    this.setData({ videoUrl, options})
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
    let options = this.data.options
    if (flag){   
      flag=false
      wx.redirectTo({
        url: './video?id=' + options.id + '&title=' + options.title + '&isDBD=' + options.isDBD + '&dbdData=' + options.dbdData + '&videoId=' + options.videoId + '&isIos=' + options.isIos + '&CREATE_BY=' + options.CREATE_BY
      })  
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      flag=true;
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
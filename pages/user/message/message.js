// pages/user/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'wd',
    bidList: [{
      title: '国网福建南平政和县供电公司生产综合用房项目检公司综房项项目', SOURCE_ID:'5d919590e6727a09c47e8b06'
    }, { title: '国网福建南平政和县供电公司生产综合用房项目检公司综房项项目国网福建南平政和县供电公司生产综合用房项目检公司综房项项目'}, {}, {}, {}, {}, {}]
  },
  toggle(e){
    let status = e.currentTarget.dataset.id
    this.setData({
      status
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  }
})
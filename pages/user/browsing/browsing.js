// pages/user/browsing/browsing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bidList: [],
    listMsg:'',
    isMessage:false,
    collect:{}
  },
  fetchSearch(e) {
    let val = e.detail.val, bidList = [], browseRecord = wx.getStorageSync('browseRecord'), listMsg = '', isMessage=false;
    browseRecord.forEach(item=>{
      item.isView=false
    })
    if(val){
      browseRecord.forEach(item=>{
        if (item.NAME.indexOf(val)>-1){
          bidList.push(item)
        }
      })
    }
    else{
      bidList = browseRecord;
    }
    if(bidList.length){
      listMsg=''
      isMessage=false
    }else{
      listMsg = '暂无数据'
      isMessage = true
    }
    this.setData({
      bidList,
      listMsg,
      isMessage
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
    let collect = wx.getStorageSync('collect') || {}
    this.setData({
      collect
    })
    let bidList = wx.getStorageSync('browseRecord')||[], listMsg, isMessage;
     bidList.forEach(item=>{
      item.isView=false
    })
    if (bidList.length) {
      listMsg = ''
      isMessage = false
    } else {
      listMsg = '暂无数据'
      isMessage = true
    }
    this.setData({
      bidList,
      listMsg,
      isMessage
    })
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
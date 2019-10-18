// pages/user/suggest/suggest.js
const commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '提个建议', value: '提个建议' },
      { name: '系统出错', value: '系统出错', checked: false},
      { name: '不好用', value: '不好用' },
      { name: '其他', value: '其他' },
    ],
    radioVal:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  radioChange(e) {
    this.setData({
      radioVal: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindFormSubmit(e) {
    let suggestVal = e.detail.value.textarea, radioVal = this.data.radioVal;
    if (!suggestVal.trim() || !radioVal){
      wx.showToast({
        title: '请完整填写!',
        icon:'none',
        duration: 2000
      })
      return
    }

    ajax({
      url: '/Feedback/Add',
      data: {
        type: radioVal,
        remark: suggestVal
      },
      type:'POST'
    }).then((res) => {
      var data = commonJs.getDefalutResponse(res.data)
        wx.showToast({
          title: data.msg,
      duration: 1500,
      mask:true
    })
    setTimeout(()=>{
      wx.navigateBack()
    },1500)
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
// pages/user/saoma/saoma.js
const app = getApp(),commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'',
    code:'',
    url:'',
    isUum:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    let msg = '', isUum =app.isUum;
    if (isUum){
      msg ='易交易电子交易平台登录确认'
    }else{
      msg ='请绑定在易交易平台注册的手机账号'
    }
    this.setData({
      code:options.code,
      url: options.url,
      msg,
      isUum
    })
  },
  saoma() {//扫码
     let  _that=this;
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: (res) => {
          let result;
          try {
            result = JSON.parse(res.result)
          }
          catch (e) {
            result = {}
          }
          let { mark, url, code, create_time } = result;
          if (mark == 'sx_uum_login') {
            ajax({
              url: '/Member/ScanNotify',
              data: {
                url,
                code
              }
            }).then(res => {
              let data = res.data.data
              if (data.result) {
                _that.setData({
                  url,
                  code,
                  msg:'易交易电子交易平台登录确认'
                })
              } else {
                wx.showToast({
                  title: data.msg,
                  image: '../../../images/warn.png',
                  duration: 2000
                })
              }
            })
          } else {
            wx.showToast({
              title: '无效二维码',
              image: '../../../images/warn.png',
              duration: 2000
            })
          }          
        }, fail(res) {
          
        }
      })
  },
  pcLogin(){
    let {code,url}=this.data,_that=this;
    ajax({
      url:'/Member/LoginNotify',
      data:{
        code,
        url
      }
    }).then(res=>{
      let data=res.data.data
      if (data.result){
         wx.showToast({
        title: '登录成功',
        duration: 1500,
        mask: true
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      }else{
        _that.setData({
          url: '',
          code: '',
          msg: data.msg
        })
      }  
    })
  },
  cancel(){
    wx.switchTab({
      url: '../index/index'
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
// pages/login/login.js
var commonJs = require('../../../utils/common'), ajax = commonJs.ajax, app = getApp(), host = commonJs.host, showToast = commonJs.showToast, TIMERID, md5 = require('../../../utils/md5'),notePass=true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noteVal: '',
    imgUrl: '',
    imgCode: '',
    phone: '',
    noteCode: '',
    countDown:60,
    isShade:false
  },
  getCode(e) {
    var type = e.target.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  imgsrc() {
    var num = Math.ceil(Math.random() * 1000)
    this.setData({
      imgUrl: host+'/Login/GetIMGCode?random=' + num + '&sid=' + app.sessionid,
    })
  },
  pickNote() {
    var that = this, phone = this.data.phone, flag = false, msg, code = app.wxCode, tm = new Date().getTime();
    if (!(/^1[1-9]\d{9}$/.test(phone))) {
      msg = '手机号码有误'
      flag = true
    }
   if (!phone) {
      msg = '手机号必填'
      flag = true
    }
    if (flag) {
      showToast({
        title: msg,
        image: '../../../images/warn.png'
      })
      return
    }
    if (!notePass){//防止重复点击
      return
    }
    notePass = false
    that.setData({
      isShade: true
    })
    TIMERID = setInterval(function () {
      that.setData({
        countDown: --that.data.countDown
      })
      wx.nextTick(() => {
        if (that.data.countDown == 0) {
          notePass=true
          clearTimeout(TIMERID)
          that.setData({
            countDown: 60,
            isShade: false
          })
        }
      })
    }, 1000);
    wx.login({
      success(res){
        ajax({
          url: '/Login/GetSMSCodeV2',
          data: {
            phone: phone,
            code: res.code,
            tm: tm,
            signature: md5(phone + res.code + tm + 'keidkie34kdshcek3')
            // imgcode: imgCode
          }
        }).then((res) => {
          msg = '', flag = true;
          if (res.data.status == '200') {
            msg = '短信验证码发送'
            showToast({
              title: msg,
            })
          }
          else {
            flag = false
            msg = res.data.msg
            wx.showModal({
              title: '提示',
              content: msg,
              confirmText: "确定",
              showCancel: false,
              success(res) {
              }
            })
          }        
        })
      }
    })  
  },
  loginVip(){//免验证登录
    var that = this
    var noteCode = this.data.noteCode, phone = this.data.phone, flag = false, msg;
     if (!phone) {
      msg = '手机号必填'
      flag = true
    }
    if (flag) {
      showToast({
        title: msg,
        image: '../../../images/warn.png'
      })
      return
    }
    wx.login({
      success: function (res) {
        ajax({
          url: '/Login/LoginDev',
          data: {
            OPENID: 'o9_lc5deKbHfqGdGkPrVQ9FMJjjU',//17746075603
            phone: phone
          }
        }).then((res) => {
          var data = res.data
          if (data.status == 200) {
            app.token_type = data.data.token_type
            app.access_token = data.data.access_token
            app.userName = data.data.username||''
            app.isUum = data.data.isuum
            app.log_debug = data.data.log_debug || ''
            wx.showToast({
              title: '绑定成功',
              duration: 1500,
              mask: true
            })
            setTimeout(() => {
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.switchTab({
                url: '/pages/user/index/index',
              })
            }, 2500)
          } else {
            wx.showModal({
              title: '提示',
              content: data.msg,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  // that.imgsrc()
                }
              }
            })
          }
        })
      }
    });
  },
  login(){
    // this.loginVip()
    // return
    var that = this
    var noteCode = this.data.noteCode, phone = this.data.phone, flag = false, msg;
    if (!noteCode) {
      msg = '短信验证码必填'
      flag = true
    } else if (!phone) {
      msg = '手机号必填'
      flag = true
    }
    if (flag) {
      showToast({
        title: msg,
        image: '../../../images/warn.png'
      })
      return
    }
    wx.login({
      success: function (res) {
        ajax({
          url: '/Login/Login',
          data: {
            code: res.code,
            sms_check_code: noteCode,
            username: phone
          }
        }).then((res) => {
          var data= res.data
          if (data.status==200){
            app.token_type = data.data.token_type
            app.access_token = data.data.access_token 
            app.userName = data.data.username 
            app.isUum = data.data.isuum
            app.log_debug = data.data.log_debug||''
            wx.showToast({
              title: '绑定成功',
              duration: 1500,
              mask: true
            })
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/user/index/index',
              })
            },2500)    
          }else{
            wx.showModal({
              title: '提示',
              content: data.msg,
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  // that.imgsrc()
                }
              }
            })
          }
        })
      }
    });
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
    notePass=true
    clearTimeout(TIMERID)
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
  // onShareAppMessage: function () {

  // }
})
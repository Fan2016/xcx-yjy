// pages/demo/demo.js
var commonJs = require('../../utils/common'),
  ajax = commonJs.ajax, treeUtil = commonJs.treeUtil,
  app = getApp(), 
  // aesjs = require('../user/asejs-npm/miniprogram_npm/aes-js/index.js'),
  md5=require('../../utils/md5')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://192.168.118.154:6006/Login/GetIMGCode?sid=' + app.sessionid,
    list:[
      {name:'1'},
      { name: '2' },
      { name: '3' },
      { name: '4' },
      { name: '5' },
    ],
    code: '',
    phone:'',
    noteVal: '',
    imgCode:'',
    phone:'',
    noteCode:'',
    option:{
      time:[
        { name: '全部',val:''},
        { name: '当天', val: 0 },
        { name: '近三天', val: 3 },
        { name: '近十天', val: 10 },
        { name: '近一月', val: 30 },
        { name: '近三月', val: 90 },
      ],
      state:[
        { name: '全部', val: '' },
        { name: '待开标', val: 1 },
        { name: '已开标', val: 2 },
        { name: '其他', val: 3 },
      ],
      money:[
        { name: '全部', mStart: '',mEnd:'' },
        { name: '400万以下', mStart: '', mEnd: '400' },
        { name: '400万 ~ 1000万', mStart: '400', mEnd: '1000' },
        { name: '1000万 ~ 3000万', mStart: '1000', mEnd: '3000' },
        { name: '3000万 ~ 5000万', mStart: '3000', mEnd: '5000' },
        { name: '5000万以上', mStart: '5000', mEnd: '' },
      ]
    },
    videoUrl:'https://mp.weixin.qq.com/s/MOahsp6NdhzzAvTXpU4faA'
    

  },
  onLoad: function (options) {
    // setTimeout(function(){
    //   console.log(this)
    // },1000)
    return
  },
  abc(a, b) {
    // app.token_type='change'
    // commonJs.test()
  },
  getCode(e) {
    var type = e.target.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  abc(){
    wx.navigateTo({
      url: '/pages/homePage/index/index'
    })
    // wx.redirectTo({
    //   url: '/pages/homePage/index/index'})
    // this.setData({
    //   ['list[4].name']:'aaa'
    // })
  },
  imgsrc() {
     var num = Math.ceil(Math.random() * 1000)
    this.setData({
      url: 'http://192.168.118.154:6006/Login/GetIMGCode?random=' + num + '&sid=' + app.sessionid,
    })
   
    // console.log(num)
    // this.setData({
    //   url: 'http://192.168.118.154:6006/Login/GetIMGCode?phone=18950443794'
    // })
    // ajax({ url:'http://192.168.118.154:6006/Login/GetIMGCode'}).then((res)=>{
    //   // debugger
    //   this.setData({
    //     url: res.data
    //   })
    //   console.log(res.data)

    // })
  },
  note() {
    var imgCode = this.data.imgCode, phone = this.data.phone, flag=false,msg;
    if (!imgCode){
      msg = '图片验证码必填'
      flag=true
    } else if (!phone){
      msg = '手机号必填'
      flag = true
    }
    if (flag){
      wx.showToast({
        title: msg,
        // icon: 'success',
        image:'../../images/warn.png',
        duration: 1500,
        mask:true
      })
      return
    }
    ajax({
      url: 'http://192.168.118.154:6006/Login/GetSMSCode',
      data: {
        phone: phone,
        imgcode: imgCode
      }
    }).then((res) => {})
  },
  getNote(e) {
    var type = that.data.type;


    // this.setData({
    //   noteVal: e.detail.value
    // })
  },
  login() {
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
      wx.showToast({
        title: msg,
        // icon: 'success',
        image: '../../images/warn.png',
        duration: 1500,
        mask: true
      })
    }
    return
    wx.login({
      success: function(res) {
        ajax({
          url: 'http://192.168.118.154:6006/Login/Login',
          // url:'http://192.168.118.154:6006/Login/LoginDev?phone=15980102764',
          data: {
            code: res.code,
            sms_check_code: that.data.noteVal,
            username: '18950443794'
          }
        }).then((res) => {
          debugger
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */

  stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);  // get char   
      st = [];                 // set up "stack"  
      do {
        st.push(ch & 0xFF);  // push byte to stack  
        ch = ch >> 8;          // shift value down by 1 byte  
      }
      while (ch);
      // add stack contents to result  
      // done because chars have "wrong" endianness  
      re = re.concat(st.reverse());
    }
    // return an array of bytes  
    console.log(re)
    return re;
  },
  encrypt(){
    // debugger
    // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
    var key = this.stringToBytes('GcA*23jKJf0df09Osf09123ljlJF0920');

    // Convert text to bytes1546275661
    var text = '1546275661&0617gaFB19IQyd0o4UDB1OIkFB17gaFG&phone=1898554';
    var textBytes = aesjs.utils.utf8.toBytes(text);
    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log(encryptedHex);
    // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
    //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log(decryptedText);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('demo-onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('demo-onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('demo-onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('demo-onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
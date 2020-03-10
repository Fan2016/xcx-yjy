// pages/subscription/index/configComponentList/configComponentList.js
var app = getApp(),
  commonJs = require('../../../../utils/common'),
  ajax = commonJs.ajax
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nameCode: "", //当前展示什么选择
    sspConf: {}, //配置
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let text = "";
    // this.getConfig();
    this.setData({
      nameCode: options.nameCode || "",
      sspConf: JSON.parse(options.sspConf),//ssp-conf组件传值也许是没保存也许是保存了
    })
    switch (options.nameCode) {
      case "category":
        text = "行业选择";
        break;
      case "price":
        text = "预算金额选择";
        break;
      case "region":
        text = "地区选择";
        break;
      case "time":
        text = "时间选择";
        break;
    }
    wx.setNavigationBarTitle({
      title: text,
      success: function(res) {
        // success
      }
    })
    console.log(options.nameCode)

  },
  //获取配置
  getConfig() {
    let sspConf = wx.getStorageSync('sspConf')
    if (!sspConf) {
      ajax({
        url: '/Search/GetData?method=Vip.XCX_GetDinYue'
      }).then(({
        data
      }) => {
        let {
          status,
          msg
        } = data
        if (status === '200') {
          if (data && data.data && data.data.data && data.data.data[0]) {
            let config = JSON.parse(data.data.data[0].CONFIG)
            this.setData({
              sspConf: config
            })
          }
        }
      })
    } else {
      this.setData({
        sspConf: sspConf
      })
    }
  },
  //共有配置调整
  commonChangeSspConf(sspConf) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    this.data.sspConf = sspConf;
    prevPage.setData({
      sspConf: sspConf,
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //行业配置
  changeSspConfCategory({
    detail
  }) {
    let sspConf = this.data.sspConf,name="",value=[]
    detail.forEach((item)=>{
      name += item.NAME+",";
      value.push(item.CODE);
    })
    name = name.substr(0, name.length - 1)
    sspConf.category = {
      name: name,
      value: value,
      detail: detail
    }
    this.commonChangeSspConf(sspConf)
  },
  //地区配置
  changeSspConfRegion({
    detail
  }) {
    let sspConf = this.data.sspConf, name = "", value = []
    detail.forEach((item) => {
      name += item.NAME + ",";
      value.push(item.ID);
    })
    name = name.substr(0, name.length - 1)
    sspConf.region = {
      name: name,
      value: value,
      detail: detail
    }
    this.commonChangeSspConf(sspConf)
  },
  //金额配置
  changeSspConfPrice({
    detail
  }) {
    let sspConf = this.data.sspConf
    sspConf.price = {
      name: detail.name,
      value: detail.value,
    }
    this.commonChangeSspConf(sspConf)
  },
  //时间配置
  changeSspConfTime({
    detail
  }) {
    this.commonChangeSspConf('time', detail)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onReachBottom: function() {

  },
})
// components/common/footer-bar/footer-bar.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageUrl: {
      type: String,
      value: ''
    },
    subNum: {
      type: String,
      value: ''
    },
    userName:{
      type: Boolean,
      value:false
    },
    isMeUpdate:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    indexUrl:'/pages/homePage/index/index',
    subscriptionUrl: '/pages/subscription/index/index' ,
    userUrl:'/pages/user/index/index'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    redirection(e){
      var openUrl = getCurrentPages(), flag = false, backCount = 0, url = e.currentTarget.id;
      app.indexIsUpdate=true
      if (url != this.data.pageUrl){
        if (!this.data.userName && url == this.data.subscriptionUrl){
          wx.navigateTo({ url: '/pages/subscription/index/configPage/configPage' })
        }else{
          wx.switchTab({ url: url})
        }  
      }
    }
  }
})

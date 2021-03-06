// components/common/home-slide/home-slide.js

var timer = "";
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    background: ["../../../images/homeSlide_1.jpg", "../../../images/homeSlide_2.jpg", "../../../images/homeSlide_3.jpg", "../../../images/homeSlide_4.jpg"],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    H: '100%',
  },

  /**
   * 组件的方法列表
   */
  ready() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.system.indexOf('iOS') > -1) {
          that.queryMultipleNodes()
        }
      }
    })
  },
  methods: {
    queryMultipleNodes() {
      var that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('.ad').boundingClientRect(function(rect) {
        that.setData({
          H: rect.height + 45 + "px"
        })
      }).exec()
    },
    enter(){
      this.triggerEvent('closeEvent', {})
    },
    bindchange(e) {
      console.log('current:' + e.detail.current)
      var current = e.detail.current
    },
    bindtransition(e) {
      // console.log('bindtransition:' + e.detail.dx)
    }
  }
})
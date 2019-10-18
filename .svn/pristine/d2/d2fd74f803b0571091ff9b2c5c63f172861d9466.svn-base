// components/common/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // hotWord: {
    //   type: Array,
    //   value: ['香格里拉', '西雅图', '勇士', '四川大坝2']
    // },
    searchVal:{
      type:String,
      value:''
    },
    isRegion: {
      type: Boolean,
      value: false
    },
    site:{
         type: Array,
         value: [0,0]
    },
    storageSite: {
      type: Boolean,
      value: true
    } 
  },
  /**
   * 组件的初始数据
   */
  data: {
    isSearch: false,
    searchHistory: [],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    fetchRegion(e){
      var val=e.detail;
      this.triggerEvent('areaEvent', { val: val })
    },
    searchFocus(e) {
      var history = wx.getStorageSync('searchHistory')
      this.setData({
        isSearch: true,
        searchHistory: history
      })
    },
    search(e) {
      var val = e.detail.value
      this.searchEvent(val)
    },
    searchEvent(val){
      this.addHistory(val)
      this.setData({
        isSearch: false,
        searchVal: val
      })
      this.triggerEvent('searchEvent',{val:val})
    },
    searchCancel() {
      this.setData({
        isSearch: false,
        searchVal: ''
      })
    },
    searchKey(e) {
      var val = e.target.dataset.key
      this.searchEvent(val)
    },
    historyDel() {
      var that = this
      wx.showModal({
        title: '提示',
        content: '是否删除历史搜索记录',
        success(res) {
          if (res.confirm) {
            wx.setStorageSync('searchHistory', [])
            that.setData({
              searchHistory: []
            })
          } else if (res.cancel) {

          }
        }
      })
    },
    addHistory(value) {
      var history = wx.getStorageSync('searchHistory') || [],
        flag = true
      if (value) {
        history.forEach(item => {
          if (item == value) {
            flag = false
          }
        })
        if (flag) {
          history.unshift(value)
          wx.setStorageSync('searchHistory', history)
        }
      }
    }
  }
})
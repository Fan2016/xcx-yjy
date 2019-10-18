// components/common/yjy-state/yjy-state.js
let app = getApp()
let commonJs = require('../../../utils/common')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stateObj: {
      type: Object,
      value: {
        name: '',
        value: ''
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    stateList:[],
    state:''
  },
  lifetimes: {
    attached() {
      let option = app.option
      this.setData({
        stateList: option.state
      })
      this.handleData()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleData() {
      let { stateObj } = this.data
      this.setData({
        state: stateObj.name,
      })
    },
    lineChange({ target }) {
      let { name, val } = target.dataset
      this.setData({
        state: name
      })
      this.triggerEvent('yjy-state', {
        name: name,
        value: val
      })
    }
  }
})

// components/common/yjy-time/yjy-time.js
let app = getApp()
let commonJs = require('../../../utils/common')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeObj: {
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
    timeList:[],
    time:'',
    customStartDate: '',
    customEndDate:''
  },
  lifetimes: {
    attached() {
      let option = app.option
      this.setData({
        timeList: option.time
      })
      this.handleData()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleData() {
      let { timeList, timeObj } = this.data
      let time = '', customStartDate = '', customEndDate = ''
      timeList.forEach((item) => {
        if (item.name == timeObj.name) {
          time = timeObj.name
        }
      })
      if (!time) {
        let values = timeObj.value.split(',')
        customStartDate = values[0]
        customEndDate = values[1]
      }
      this.setData({
        time: time,
        customStartDate: customStartDate,
        customEndDate: customEndDate
      })
    },
    lineChange({ target }) {
      let { name, val } = target.dataset
      this.setData({
        time: name
      })
      this.triggerEvent('yjy-time', {
        name: name,
        value: val.toString()
      })
    },
    bindStartDate({detail}) {
      this.setData({
        customStartDate: detail.value
      })
    },
    bindEndDate({detail}) {
      this.setData({
        customEndDate: detail.value
      })
    },
    customtBtn() {
      let { customStartDate, customEndDate } = this.data
      if (!customStartDate || !customEndDate) {
        wx.showToast({
          title: '请填写完整',
          image: '/images/warn.png',
          duration: 1500,
          mask: true
        })
        return
      }
      this.triggerEvent('yjy-time', {
        name: `${customStartDate}至${customEndDate}`,
        value: `${customStartDate},${customEndDate}`
      })
    },
  }
})

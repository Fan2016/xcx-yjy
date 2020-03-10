// pages/user/message/message.js
var app = getApp(),
  commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'wd',
    bidList: [],
    ydList:[],
    wdList:[],
    isMessage:true,
    listMsg:'数据加载...',
    isLoad:true

  },
  toggle(e){
    let status = e.currentTarget.dataset.id, bidList, listMsg;
    bidList=status == 'wd' ? this.data.wdList : this.data.ydList;
    listMsg = bidList.length?'':'暂无数据';
    this.setData({
      status,
      bidList,
      listMsg
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchList()
    this.cancelUpdate();
  },
  fetchList(){
    ajax({
      url: '/Search/GetData',
      data: {
        method: 'Vip.XCX_MyMsg',
        IS_READ:''//0||1
      }
    }).then((res) => {
      let data = res.data.data.data, ydList = [], wdList = [], bidList = [], status = this.data.status, listMsg;
      data.forEach(item=>{
        if (item.IS_READ){
          ydList.push(item)
        }else{
          wdList.push(item)
        }
      })
      bidList = status == 'wd' ? [...wdList] : [...ydList];
      listMsg = bidList.length ? '' : '暂无数据';
      this.setData({
        bidList,
        ydList,
        wdList,
        listMsg,
        isLoad:false
      })
    })   
  },
  informClick(e){//点击取消未读状态
    let msg_id = e.detail.param.msg_id, IS_READ=e.detail.param.IS_READ;
    if (IS_READ)return;
    ajax({
      url:'/MyMsg/ClickByMsgId',
      data: {msg_id},
    }).then(res=>{

    })
  },
  cancelUpdate(){//取消红点状态
    ajax({
      url:'/MyMsg/Click'
    }).then(res=>{
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
    this.fetchList()
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
  }
})
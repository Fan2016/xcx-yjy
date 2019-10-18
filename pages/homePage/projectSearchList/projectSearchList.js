var app = getApp(), commonJs = require('../../../utils/common'), ajax = commonJs.ajax, DateFormat = commonJs.DateFormat, curDate = new Date(), initStartTime = DateFormat("yyyy-MM-dd"), initEndTime = DateFormat("yyyy-MM-dd", new Date(curDate.setDate(curDate.getDate() +90))) ;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bidList: [],
    isSel: false,
    isMessage: false,
    isLoad:false,
    listMsg:'',
    selParam:{
      pageindex:1,
      pagesize:10,
      NAME:'',
      in_TYPE_ALL:'',
      AREA_CODE:'',
      OPEN_TIME_START: initStartTime,
      OPEN_TIME_END: initEndTime,
      CONTROL_PRICE_START: '', 
      CONTROL_PRICE_END:'',
      in_status:'',
      // PUBLISHED_TIME_START:'',
      // PUBLISHED_TIME_END:'',
      method:'Web.XCX_GetJiaoYiList',
    },
    pageTotal:1,
    pick:[],
    tradeCountList:[],
    collect:{},
    codeGroup: ['', ''],
    baseTradeCode: '',
    baseCodeGroup: ['', ''],
    isShade:false
  },
  tradeSearch(e){
    let param = e.detail, tradeCount = this.data.tradeCountList, filtTradeType = [];
    tradeCount.forEach(item => {
      if (item.VALUE == param.val) {
        item.isCur = param.flag;
        if (param.flag) filtTradeType.push(item.VALUE);
      }
      else if (item.isCur) {
        filtTradeType.push(item.VALUE)
      }
    })
    let in_TYPE_ALL = filtTradeType.join().length ? filtTradeType.join() : this.data.baseTradeCode
    this.setData({ ['selParam.in_TYPE_ALL']: in_TYPE_ALL, isShade:true})
    this.fetchData(true,false)
  },
  fetchSearch(e) {
    var val = e.detail.val, selParam=this.data.selParam;
    selParam.NAME = val
     selParam.in_TYPE_ALL= this.data.baseTradeCode
    this.setData({
      selParam: selParam,
      codeGroup:this.data.baseCodeGroup
    })
    this.fetchData(true)
  },
  fetchData(flag = false,check=true){
    var selParam = this.data.selParam, selCountParam={}
    if(flag){
      this.setData({
        listMsg: '数据加载中...',
        isMessage: true,
        isLoad:true,
        ['selParam.pageindex']:1,
      })
    } 
    if (check){
      selCountParam = JSON.parse(JSON.stringify(selParam))
      selCountParam.method = 'Web.XCX_GetJiaoYiList_Count';
      selCountParam.BIG_TYPE=this.data.codeGroup[0];
      selCountParam.TYPE = this.data.codeGroup[1];
      delete selCountParam.pageindex
      delete selCountParam.pagesize
      ajax({
        url: '/Search/GetData',
        data: selCountParam
      }).then(res => {
        let data = res.data.data.data;
        this.setData({
          tradeCountList: data
        })
      })
    }
    ajax({
      url:'/Search/GetData',
      data: selParam
    }).then((res)=>{
      this.setData({isShade:false})
      let initData = this.data.bidList
      var total = Math.ceil(res.data.data.total / 10), bidList=[];
      if(flag){
        bidList = [...res.data.data.data]
      }else{
        bidList = [...initData, ...res.data.data.data]
      }
      if (!bidList.length){
        this.setData({
          bidList: bidList,
          listMsg:'暂无数据',
          isLoad:false
        })
      }else{
        let isMessage = false, listMsg = '';
        if (total == 1) {
          isMessage = true
          listMsg = '已获取全部数据'
        }
        this.setData({
          bidList: bidList,
          pageTotal: total,
          isMessage: isMessage,
          listMsg: listMsg,
          isLoad: false
        })
      }    
    })
  },
  fetchfiltrate(val) {
    var param = val.detail,
      handleType = param.type,
      isSel = param.isSel,
      selType = param.selType,
      selVal = param.selVal,
      allParam = param.param ;
    if (handleType == 'toggle') {
      this.setData({
        isSel: isSel
      })
    } else if (handleType == 'search') {
      let selParam=this.data.selParam,newSelParam={};
      selParam.pageindex=1
      if (selType!='trade'){
        this.setData({      
          codeGroup: this.data.baseCodeGroup
        })
      }
      switch (selType){
        case 'area':
          newSelParam = { AREA_CODE: selVal, in_TYPE_ALL: this.data.baseTradeCode}
        break;
        case 'trade':
          newSelParam = { in_TYPE_ALL: selVal }
          let codeGroup = [allParam.NAME == '全部' ? allParam.CODE : allParam.parentCode, allParam.NAME == '全部' ? '' : allParam.CODE]
          this.setData({
            codeGroup,
            baseCodeGroup: codeGroup,
            baseTradeCode: selVal
            })
        break
        case 'time':
          newSelParam = { OPEN_TIME_START: selVal.startDate, OPEN_TIME_END: selVal.endDate, in_TYPE_ALL: this.data.baseTradeCode}
          break
        case 'state':
          newSelParam = { in_status: selVal, in_TYPE_ALL: this.data.baseTradeCode }
          break
        case 'money':
          newSelParam = { CONTROL_PRICE_START: selVal.startMoney, CONTROL_PRICE_END: selVal.endMoney, in_TYPE_ALL: this.data.baseTradeCode }
          break
      }
      this.setData({
        isSel: isSel,
        selParam: Object.assign(selParam, newSelParam)
      })
     this.fetchData(true)
    }
  },
  reset() {
    this.setData({
      selParam: {
        pageindex: 1,
        pagesize: 10,
        NAME: '',
        BIG_TYPE: '',
        TYPE: '',
        AREA_CODE: '',
        OPEN_TIME_START: '',
        OPEN_TIME_END: '',
        CONTROL_PRICE_START: '',
        CONTROL_PRICE_END: '',
        in_status: '',
        // PUBLISHED_TIME_START: '',
        // PUBLISHED_TIME_END: ''
      }
    })
  },
  colse(){
    this.setData({
      isSel: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let location = wx.getStorageSync('location');
     var pick={
       pick: [{ type: 'area', parent: location.parent, val: location.name },{type:'time',val:'近三月'}],
       ['selParam.AREA_CODE']: location.code,
     }
    if (options.type){
      pick.pick.push({ type: 'trade', val: options.type });
      pick['selParam.in_TYPE_ALL'] = options.code
      pick['codeGroup'] = [options.code,'']
      pick['baseTradeCode'] = options.code
      pick['baseCodeGroup'] = [options.code, '']
    }
    this.setData(pick)
    if (options.name) {
      this.setData({
        ['selParam.NAME']: options.name
      })
    }
    
    this.fetchData(true)
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var page = this.data.selParam.pageindex,pageTotal=this.data.pageTotal,isMessage = this.data.isMessage;
    if ((page < pageTotal) && !isMessage) {
      this.data.selParam.pageindex = ++page
    } else if (!(page < pageTotal) && !isMessage) {
      this.setData({
        listMsg: '已获取全部数据',
        isMessage: true,
        isLoad:false
      })
      return
    } else {
      return
    }
    this.setData({
      listMsg: '数据加载中...',
      isMessage: true,
      isLoad:true
    })
    setTimeout(() => {
      this.fetchData(false,false)
    }, 1500)
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
    let collect = wx.getStorageSync('collect') || {};
    this.setData({ collect: collect })
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
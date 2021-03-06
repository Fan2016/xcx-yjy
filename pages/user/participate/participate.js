var commonJs = require('../../../utils/common'),
  ajax = commonJs.ajax
  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageindexTotal: 3,
    isMessage: true, //要不要提示
    isLoad: false, //加载转圈圈要不要
    listMsg: '',
    bidList: [],
    isSel: false,
    bidType: 'tb', //切换栏目
    tbList: [],
    tbPage: 1,
    tbTotal: 0, //总共几条
    tbTotalPage: 0,
    zbList: [],
    zbPage: 1,
    zbTotal: 0, //总共几条
    zbTotalPage: 0,
    selParam: {
      or: "PUBLISHED_TIME",
      pageindex: 1,
      pagesize: 10,
      NAME: '',
      in_TYPE_ALL: '',
      AREA_CODE: '',
      OPEN_TIME_START: '',
      OPEN_TIME_END: '',
      CONTROL_PRICE_START: '',
      CONTROL_PRICE_END: '',
      in_status: '',
      PUBLISHED_TIME_START: '',
      PUBLISHED_TIME_END: '',
      method: 'Vip.XCX_MyTouBiao',
    },
    tradeCountList: [],
    tbTradeCount: [],
    zbTradeCount: [],
    collect: {},
    codeGroup: ['', ''],
    baseTradeCode: '',
    baseCodeGroup: ['', ''],
    isShade:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //项目点击后调用接口说明读过
  ClickBySID(e) {
    let sid = e.detail
    ajax({
      url: '/MyBid/ClickBySID',
      data: {
        source_id: sid,
        cy_type: this.data.bidType == "tb" ? 1 : 2
      }
    }).then((res) => {
      var res = commonJs.getDefalutResponse(res.data);
      if (!res.result) {
        commonJs.showToast({
          title: res.msg
        });
      } else {
        this.data.bidList.forEach((item) => {
          if (item.SOURCE_ID == sid) {
            item.isView = false;
          }
        })
      }
    })
  },
  tradeSearch(e) {
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
    this.setData({
      ['selParam.in_TYPE_ALL']: in_TYPE_ALL,
      // bidList: [],
      sbList:[],
      zbList:[],
      isLoad: true,
      tbPage: 1,
      zbPage: 1,
      isLoad: true, //加载转圈圈要不要
      listMsg: '数据加载中...',
      isShade:true
       })
    this.getBidList({ check: false, empty:true })
  },
  //切换栏目
  cutBidType(e) {
    var bidType = e.target.dataset.type;
    // this.setData({
    //   bidList: [],
    //   bidType: val,
    //   isLoad: true,
    //   tbPage: 1,
    //   zbPage: 1,
    //   isLoad :true, //加载转圈圈要不要
    //   listMsg : '数据加载中...',
    // })
    this.setData({
      bidType
    })
    this.getBidList({ update: false, check:false});
  },
  //获取关注列表
  getBidList({ type = '', isShow = true, check = true, update=true,empty=false}={}) {
    var selParam = this.data.selParam, selCountParam = {};
    selCountParam = JSON.parse(JSON.stringify(selParam))  
    delete selCountParam.pageindex
    delete selCountParam.pagesize
    var that = this,
      type = type ? type : that.data.bidType,
      initData = [],
      bidType = {
        tbTotal: 'tbTotalPage',
        zbTotal: 'zbTotalPage'
      },
      newSelParam;
    if (type == 'tb') {
      newSelParam = {
        pageindex: that.data.tbPage,
        method: 'Vip.XCX_MyTouBiao',
      }
      selCountParam.method = 'Vip.XCX_MyTouBiao_Count';
      // initData = that.data.tbList;
    } else {
      newSelParam = {
        pageindex: that.data.zbPage,
        method: 'Vip.XCX_MyZaoBiao',
      }
      selCountParam.method = 'Vip.XCX_MyZaoBiao_Count';
      // initData = that.data.zbList;
    }
    selParam = Object.assign(selParam, newSelParam)
    if (check){
      selCountParam.BIG_TYPE=this.data.codeGroup[0];
      selCountParam.TYPE = this.data.codeGroup[1];
      ajax({
        url: '/Search/GetData',
        data: selCountParam
      }).then(res => {
        let data = res.data.data.data;
        if (isShow){
          this.setData({
            tradeCountList: data,
            [type + 'TradeCount']: data
          })
        }else{
          this.setData({
            [type + 'TradeCount']: data
          })
        }    
      })
    } 
    if (update){
      ajax({
        url: '/Search/GetData',
        data: selParam
      }).then((res) => {
        var res = commonJs.getDefalutResponse(res.data);
        if (res.result) {
          this.setData({isShade:false})
          var total = Math.ceil(res.data.total / selParam.pagesize);
          res.data.data.forEach((item, index) => {
            item["isView"] = item.MyBid_UPDATE_NUM > 0 ? true : false
            item["componentName"] = "canyu"
          })
          var bidList = [],
            listMsg = "",
            isLoad = false; 
          // if (empty){           
          //   bidList = res.data.data;
          // }
          // else{
            bidList = [...this.data[type + 'List'], ...res.data.data];
          // }
          
          if (isShow) {
            if (bidList.length == 0) {
              listMsg = '暂无数据';
              isLoad = false; //加载转圈圈要不要
            } else if (this.data.selParam.pageindex >= total) {
              listMsg = '已获取全部数据';
              isLoad = false; //加载转圈圈要不要
            } else {
              isLoad = true; //加载转圈圈要不要
              listMsg = '数据加载中...';
            }
            this.setData({
              listMsg: listMsg,
              isLoad: isLoad,
              bidList: [...bidList],
              [type + 'List']: [...bidList],//n
              [bidType[type + 'Total']]: total,           
            })
            if (check) this.setData({ [type + 'Total']: res.data.total});
          } else {
            this.setData({
              [bidType[type + 'Total']]: total,
              [type + 'Total']: res.data.total,
              [type + 'List']: bidList
            })
          }
        }
      })
    }else{
      let bidList = [...this.data[type + 'List']],
        listMsg = "",
        isLoad = false;
      if (bidList.length == 0) {
        listMsg = '暂无数据';
        isLoad = false; //加载转圈圈要不要
      } else if (this.data[type + 'Page'] >= Math.ceil(this.data[type + 'Total'] / 10)   ) {
        listMsg = '已获取全部数据';
        isLoad = false; //加载转圈圈要不要
      }
      this.setData({
        listMsg,
        isLoad,
        bidList: bidList,
        tradeCountList: [...this.data[type + 'TradeCount']]
      })
    }
      
  },
  fetchfiltrate(val) {
    var param = val.detail,
      handleType = param.type,
      isSel = param.isSel,
      selType = param.selType,
      selVal = param.selVal,
      allParam = param.param;
    if (handleType == 'toggle') {
      this.setData({
        isSel: isSel
      })
    } else if (handleType == 'search') {
      let selParam = this.data.selParam,
        newSelParam = {};
      selParam.pageindex = 1;
      if (selType != 'trade') {
        this.setData({
          codeGroup: this.data.baseCodeGroup
        })
      }
      switch (selType) {
        case 'area':
          newSelParam = {
            AREA_CODE: selVal, in_TYPE_ALL: this.data.baseTradeCode
          }
          break;
        case 'trade':
          newSelParam = {
            in_TYPE_ALL: selVal
          }
          let codeGroup = [allParam.NAME == '全部' ? allParam.CODE : allParam.parentCode, allParam.NAME == '全部' ? '' : allParam.CODE]
          this.setData({
            codeGroup,
            baseCodeGroup: codeGroup,
            baseTradeCode: selVal
          })
          break
        case 'time':
          newSelParam = {
            OPEN_TIME_START: selVal.startDate,
            OPEN_TIME__END: selVal.endDate, in_TYPE_ALL: this.data.baseTradeCode
          }
          break
        case 'state':
          newSelParam = {
            in_status: selVal, in_TYPE_ALL: this.data.baseTradeCode
          }
          break
        case 'money':
          newSelParam = {
            CONTROL_PRICE_START: selVal.startMoney,
            CONTROL_PRICE_END: selVal.endMoney, in_TYPE_ALL: this.data.baseTradeCode
          }
          break
      }
      this.setData({
        isSel: isSel,
        // bidList: [],
        zbList: [],
        tbList: [],
        isLoad: true,
        tbPage: 1,
        zbPage: 1,
        listMsg: '数据加载中...',
        isLoad: true, //加载转圈圈要不要
        selParam: Object.assign(selParam, newSelParam)
      })
      this.getBidList({ type: "zb", isShow: this.data.bidType=='zb' });
      this.setData({
        // bidList: [],
        listMsg: '数据加载中...',
        isLoad: true, //加载转圈圈要不要
      })
      this.getBidList({ type: "tb", isShow: this.data.bidType == 'tb' });
    }
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '我的参与',
      success: function(res) {
        // success
      }
    })
    this.getBidList({ type: "zb", isShow:false});
    this.setData({
      // bidList: [],
      listMsg: '数据加载中...',
      isLoad: true, //加载转圈圈要不要
    })
    this.getBidList({ type: "tb", isShow:true });
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
    let collect = wx.getStorageSync('collect') || {}
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
    console.log('Down')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var bidType = this.data.bidType,
      tbTotalPage = this.data.tbTotalPage,
      zbTotalPage = this.data.zbTotalPage,
      tbPage = this.data.tbPage,
      zbPage = this.data.zbPage;
    if (bidType == 'tb' && (tbPage < tbTotalPage)) {
      this.data.tbPage = ++tbPage
    } else if (bidType == 'zb' && (zbPage < zbTotalPage)) {
      this.data.zbPage = ++zbPage
    } else {
      return
    }
    this.setData({
      listMsg: '数据加载中...',
      isMessage: true,
      isLoad: true
    })
    setTimeout(() => {
      this.getBidList({check:false})
    }, 1500)
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
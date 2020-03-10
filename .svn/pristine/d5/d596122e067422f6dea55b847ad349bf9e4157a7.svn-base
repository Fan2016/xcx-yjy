//index.js
//获取应用实例
var app = getApp(),
  commonJs = require('../../../utils/common.js'),
  treeUtil = commonJs.treeUtil,
  initBase = commonJs.initBase,
  ajax = commonJs.ajax;
Page({
  data: {
    year: 0,
    month: 0,
    day: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isMonthQuery:false,
    isTodayWeek: false,

    todayIndex: 0,
    pageindex: 1,
    pagesize: 10,
    pageindexTotal: 3,
    isMessage: true, //要不要提示
    isLoad: true, //加载转圈圈要不要
    listMsg: '数据加载中...',
    bidList: [],
    tradeCountList:[],
    collect:{},
    type:'',
    isShade: false,
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    let collect = wx.getStorageSync('collect') || {}
    this.setData({ collect: collect })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  onLoad: function() {
    // this.getRegion();
    location = wx.getStorageSync('location')//首页地区
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    month = month < 10 ? "0" + month:month;
    let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    this.setData({
      year,
      day,
      month,
      AREA_CODE: location.code || "",//默认全国
      site: location.site || [],//首页传过来的地区
      isToday: '' + year + '-' + month + '-' + day
    })
    if (!app.sessionid) {
      initBase()
    } 
    this.dateInit();
    this.selectComponent("#test").getRegion(location);
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
    this.setData({
      type: filtTradeType.join(),
      pageindex: 1,
      listMsg: "数据加载中",
      isLoad: true,
      isShade: true
    })
    this.fetchData({empty:true})
  },
  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let preYear = year;
    let preMonth = month;
      if (preMonth == 0)//去年的12月
      {
        preYear = year - 1;
        preMonth = 11;
      }
    let preDayNums = new Date(preYear, preMonth, 0).getDate(); //获取上个月有多少天
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let strWeek = year + "/" + (month + 1) + "/" + 1
    let startWeek = new Date(strWeek).getDay();//目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    let weekNum = Math.ceil(arrLen / 7);
    var starttime = year + "-" + (month + 1) + "-01";
    var endtime = year + "-" + (month + 1) + "-" + dayNums;
    ajax({
      url: '/Search/GetData',
      data: {
        method: "Web.XCX_GetOpenCal",
        starttime: starttime,
        endtime: endtime,
        AREA_CODE: this.data.AREA_CODE,
      }
    }).then((res) => {
      var res = commonJs.getDefalutResponse(res.data);
      if (res.result) {
        let finalMonth = (month + 1);
        if ((month + 1) <= 9) //字符串是09，不要9
        {
          finalMonth = "0" + finalMonth
        }
        var countList = res.data.data || [];
        var count = 0;        
        for (let i = 0; i < weekNum * 7; i++) {
          // for (let i = 0; i < arrLen; i++) {
          if (i >= startWeek && i < arrLen) {
            count = 0;
            num = i - startWeek + 1;
            for (let j = 0; j < countList.length; j++) {
              var day = countList[j].DAY.split("-")[2];
              if (parseInt(day) === num) {
                count = countList[j].COUNT || "";
              }
            }
            obj = {
              isToday: '' + year + '-' + finalMonth + '-' + (num<10?'0'+num:num),
              dateNum: num,
              count: count,
            }
          } else {
            if (i <startWeek) {
              obj = {
                dateNum: parseInt(preDayNums -startWeek+i+1),
                tag: "pre",
              }
            }
            if (i >= arrLen)
            {
              obj = {
                dateNum: parseInt(i - arrLen + 1),
                tag: "next",
              }
            }
          }
          dateArr[i] = obj;
        }
        this.setData({
          dateArr: dateArr
        })
        let nowDate = new Date();
        let nowYear = nowDate.getFullYear();
        let nowMonth = nowDate.getMonth() + 1;
        let nowWeek = nowDate.getDay();
        let getYear = setYear || nowYear;
        let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
        if (nowYear == getYear && nowMonth == getMonth) {
          this.setData({
            isTodayWeek: true,
            todayIndex: nowWeek
          })
        } else {
          this.setData({
            isTodayWeek: false,
            todayIndex: -1
          })
        }
        this.showTodayTender(null)
      }
    })
  },
  //点击日历中的日期显示当天的开标列表
  showTodayTender(e, countUpdate=true) {
    let timeStart = "", timeEnd = "", empty = false, isMonthQuery = this.data.isMonthQuery, isToday = '';
    this.setData({ isShade: true})
    if (!e) //为null的时候是今天的开标列表，一开始进入调用或者是日历上的日期选择bindDateChange
    {
      if (isMonthQuery){
        let year = this.data.year, month = this.data.month;
        timeStart = year + '-' + month+'-01';
        timeEnd = year + '-' + month + '-' + new Date(year, month, 0).getDate()
      }else{
        isToday=timeStart = timeEnd = this.data.isToday;
      }   
    } else //点击日历上的日期后调用
    {
      isToday=timeStart = timeEnd = e.currentTarget.dataset.date;
      empty=true;
      let date = timeStart.split('-')
      this.setData({
        pageindex: 1,
        listMsg: "数据加载中",
        isLoad: true,
        year: date[0],
        month: date[1],
        day: date[2],
        isMonthQuery:false
      })
    }
    if (countUpdate){
      ajax({
        url: '/Search/GetData',
        data: {
          method: 'Web.XCX_GetJiaoYiList_Count',
          OPEN_TIME_START: timeStart,
          OPEN_TIME_END: timeEnd,
          AREA_CODE: this.data.AREA_CODE || "",
          or: "OPEN_TIME"
        }
      }).then(res => {
        let data = res.data.data.data;
        this.setData({
          tradeCountList: data,
        })
      })
    }
    this.setData({isToday})
    this.fetchData({empty})
  },
  fetchData({empty=false}={}){
    let timeStart = "", timeEnd = "", isMonthQuery = this.data.isMonthQuery;
    if (isMonthQuery) {
      let year = this.data.year, month = this.data.month;
      timeStart = year + '-' + month + '-01';
      timeEnd = year + '-' + month + '-' + new Date(year, month, 0).getDate()
    } else {
      timeStart = timeEnd = this.data.isToday;
    } 
    ajax({
      url: '/Search/GetData',
      data: {
        or: "OPEN_TIME",
        method: "Web.XCX_GetJiaoYiList",
        OPEN_TIME_START: timeStart,
        OPEN_TIME_END: timeEnd,
        AREA_CODE: this.data.AREA_CODE || "",
        pageindex: this.data.pageindex,
        pagesize: this.data.pagesize,
        in_TYPE_ALL:this.data.type
      }
    }).then((res) => {
      this.setData({ isShade: false })
      var res = commonJs.getDefalutResponse(res.data);
      if (res.result) {
        var total = Math.ceil(res.data.total / this.data.pagesize),
          isLoad = false,
          listMsg = "";
        let bidList;
          if(empty){
            bidList =res.data.data;
          }else{
             bidList = [...this.data.bidList, ...res.data.data];
          }
        
        if (bidList.length == 0) {
          listMsg = '暂无数据';
          isLoad = false; //加载转圈圈要不要
        } else if (this.data.pageindex >= total) {
          listMsg = '已获取全部数据';
          isLoad = false; //加载转圈圈要不要
        } else {
          isLoad = true; //加载转圈圈要不要
          listMsg = '数据加载中...';
        }
        this.setData({
          bidList: bidList,
          listMsg: listMsg,
          isLoad: isLoad,
          pageindexTotal: total
        })
      }
    })
  },
  lastMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1 上一月
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1  下一月
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var pageindex = this.data.pageindex,
      isLoad = this.data.isLoad,
      pageindexTotal = this.data.pageindexTotal;

    if ((pageindex < pageindexTotal)) {
      this.data.pageindex = ++pageindex
    } else if (pageindex >= pageindexTotal) {
      console.log(pageindex)
      return
    }
    setTimeout(() => {
      this.showTodayTender(null,false)
    }, 1500)
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let curMonth = this.data.month;
    let curYear = this.data.year;
    let data = e.detail.value.split("-");
    this.setData({
      year: data[0],
      month: data[1],
      day: '',
      bidList: [],
      isToday: '' + data[0] + '-' + data[1],
      isMonthQuery:true 
    })
    //.toString().replace(/^0/, '')
    if (curYear == data[0]&&curMonth == data[1]) {
      this.showTodayTender(null)
    } else {
      this.dateInit(data[0], data[1] - 1);
    }
    console.log(this.data.isToday);
  },
  //地区组件传值
  regionSelectEvent(param){
    this.setData({
      AREA_CODE: param.detail.AREA_CODE,
      bidList: [],
      pageindex: 1,
    })
    this.dateInit(this.data.year, parseInt(this.data.month)-1);
  },
})
// components/common/yjy-area/yjy-area.js
let app = getApp()
let commonJs = require('../../../utils/common')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    regionObj: {
      type: Object,
      value: {
        name: '',
        value: [],
        detail: []
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    areaTop: [],
    areaSub: {},
    areaSubList: [],
    areaTopVal: '',
    selectRegion: {}, //选中的每个省份的地区
    selectRegionList: {}, //选中的每个省份的地区的列表，判断是否选中
    preView: false, //上一次的数据是否已经处理
  },

  lifetimes: {
    attached() {
      this.getTree();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getTree() {
      let option = app.option,
        area = new commonJs.treeUtil([...option.area], 'ID', 'PID'),
        areaTree = area.toTree()
      let areaTop = [],
        selectRegion = {},
        selectRegionList = {},
        areaSub = {
          // '全国': []
        }
      areaTree.forEach(item => {
        areaTop.push({
          NAME: item.NAME,
          ID: item.ID
        })
        areaSub[item.NAME] = [{
          NAME: '全部',
          PARENTNAME: item.NAME,
          ID: item.ID.substring(0, 2) //只传前两位
        }].concat(item.children)
      });
      for (var key in areaSub) {
        selectRegion[key] = [];
        selectRegionList[key] = {}
      }
      this.setData({
        areaTop: areaTop,
        areaSub: areaSub,
        selectRegion: selectRegion,
        selectRegionList: selectRegionList,
      })
      this.handleData()
      console.log(selectRegion)
    },
    handleData() {
      let {
        areaTop,
        areaSub,
        regionObj
      } = this.data
      let areaTopVal, PARENTNAME = "";
      if (regionObj.detail && regionObj.detail.length > 0) {
        let e = {
          detail: {
            value: regionObj.detail,
            preDataView: true,
          }
        }
        this.areaChange(e)
      } else {
        areaTopVal = '河北省'
        this.setData({
          areaTopVal: areaTopVal,
          areaSubList: areaSub[areaTopVal]
        })
      }
    },
    barChange({
      target
    }) {
      let {
        dataset
      } = target
      let {
        level,
        areaItem
      } = dataset
      let preDataView = false;
      if (level == '1') {
        this.setData({
          areaTopVal: areaItem.NAME,
          areaSubList: this.data.areaSub[areaItem.NAME]
        })
        preDataView = this.data.regionObj.value.length == 0 ? false : true
        let e = {
          detail: {
            value: this.data.selectRegion[areaItem.NAME],
            preDataView: preDataView,
          }
        }
        this.areaChange(e)
      }
    },
    //重置的情况
    reset() {
      this.getTree();
    },
    //确定的情况
    regionConfirm() {
      let selectRegion = this.data.selectRegion;
      let areaSub = this.data.areaSub,
        finalRegion = [];
      for (let key in selectRegion) {
        if (selectRegion[key].length != 0) {
          selectRegion[key].forEach((item, index) => {
            areaSub[key].forEach((areaList) => {
              if (areaList.ID == item) {
                finalRegion.push({
                  PARENTNAME: areaSub[key][0].PARENTNAME, //省
                  NAME: areaList.NAME == "全部" ? areaList.PARENTNAME : areaList.NAME, //市
                  ID: areaList.ID
                })
              }
            })
          })
        }
      }
      this.triggerEvent('yjy-area', finalRegion)
    },
    //上一次数据
    preDataView(regionObj) {
      let {
        areaSub
      } = this.data
      let areaTopVal = "",
        PARENTNAME = "";
      regionObj.forEach((list, index) => {
        if (index == 0) {
          PARENTNAME = list.PARENTNAME
        }
        this.data.selectRegion[list.PARENTNAME].push(list.ID)
        this.data.selectRegionList[list.PARENTNAME][list.ID] = true
      })
      areaTopVal = PARENTNAME
      this.setData({
        areaTopVal: areaTopVal,
        areaSubList: areaSub[areaTopVal],
        preView: true,
      })
    },
    //a数组的元素是否在B数组也有
    exitEqual(a, key, b) {
      let teap = 0;
      for (let i = 1; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
          if (a[i][key] === b[j]) {
            teap++;
          }
        }
      }
      teap = teap == b.length ? true : false;
      return teap;
    },
    //一个省复选框发生改变
    areaChange(e) {
      let selectRegionList = {},
        selectALL = {},
        isAll = false,
        cancelAll = true,
        selectRegion = [];
      if (e.detail.preDataView) {
        if (!this.data.preView) {
          this.preDataView(e.detail.value);
        }
        selectRegion = [];
        e.detail.value = this.data.selectRegion[this.data.areaTopVal];
      } else {
        selectRegion = this.data.selectRegion[this.data.areaTopVal]; //之前的值赋值下
        this.data.selectRegion[this.data.areaTopVal] = e.detail.value
      }
      e.detail.value.length == 0 ? null : e.detail.value.sort();
      if (e.detail.value.length > 0 && this.data.areaSubList.length == 1) //说明省下面只有一个。比如说福建省的下级还是福建省
      {
        selectRegionList[e.detail.value[0]] = true;
      } else {
        if (selectRegion.length == 1 && selectRegion[0] == this.data.areaSubList[0].ID) //这个省份已经全选过了。取消全部的情况
        {
          cancelAll = this.exitEqual(this.data.areaSubList, "ID", e.detail.value)
          if (cancelAll) { //点击取消全部
            selectRegionList = {};
            this.data.selectRegion[this.data.areaTopVal] = [];
          } else //不是点击取消全部，那么就要把全部不能选中。
          {
            this.data.selectRegion[this.data.areaTopVal] = [];
            e.detail.value.forEach((item, index) => { //
              if (item.length != 2) //不要把全部选中
              {
                selectRegionList[item] = true;
                this.data.selectRegion[this.data.areaTopVal].push(item);
              }
            })
          }
        } else {
          if (this.data.areaSubList.length == e.detail.value.length + 1) //只有全部没有选中，其他市区都被选中
          {
            isAll = this.exitEqual(this.data.areaSubList, "ID", e.detail.value)
          }
          e.detail.value.forEach((item, index) => { //这个省选中的 checked为true
            if (item.length == 2 || this.data.areaSubList.length == e.detail.value.length + 1 && item === this.data.areaSubList[index + 1].ID) //选中的是省的全部或者是所有的市都选中，全部也要自动勾选
            {
              item = item.length == 2 ? item : this.data.areaSubList[0].ID;
              selectALL = {};
              selectALL[item] = true;
              isAll = true;
              this.data.selectRegion[this.data.areaTopVal] = [];
              this.data.selectRegion[this.data.areaTopVal].push(item);
            } else {
              selectRegionList[item] = true;
            }
          })
          if (isAll) {
            selectRegionList = selectALL;
          }
        }
      }
      var str = 'selectRegionList.' + this.data.areaTopVal
      this.setData({
        [str]: selectRegionList
      })
    },
  }
})
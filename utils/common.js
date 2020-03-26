var app = getApp(),
  host = 'https://xcxapi.enjoy5191.com';//正式
  // host ='https://sxxcx.enjoy5191.com:26006'//测试
function DateFormat(format, date) {
  if (!date) {
    date = new Date();
  }
  var o = {
    "y+": date.getYear(), //year
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "H+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3),  
    "S": date.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;

}
function ajax(option) {
  var data = option.data || {},
    api = {
      host: host
    },
    url, type;
  url = option.host ? option.host + option.url : api.host + option.url;
  type = option.type ? option.type : "GET"
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        Authorization: app.token_type + ' ' + app.access_token,
        Cookie: 'ASP.NET_SessionId=' + app.sessionid,
        log_debug: app.log_debug,
      },
      url: url,
      method: type,
      data: data,
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
}

function treeUtil(data, key, parentKey, map) {
  this.data = data;
  this.key = key;
  this.parentKey = parentKey;
  this.treeParentKey = parentKey; //parentKey要转换成什么属性名称
  this.treeKey = key; //key要转换成什么属性名称
  this.map = map;
  if (map) {
    if (map[key]) this.treeKey = map[key];
  }
  this.toTree = function() {
    var data = this.data;
    var pos = {};
    var tree = [];
    var i = 0;
    while (data.length != 0) {
      if (data[i][this.parentKey] == 0) {
        var _temp = this.copy(data[i]);
        tree.push(_temp);
        pos[data[i][this.key]] = [tree.length - 1];
        data.splice(i, 1);
        i--;
      } else {
        var posArr = pos[data[i][this.parentKey]];
        if (posArr != undefined) {
          var obj = tree[posArr[0]];
          for (var j = 1; j < posArr.length; j++) {
            obj = obj.children[posArr[j]];
          }
          var _temp = this.copy(data[i]);
          obj.children.push(_temp);
          pos[data[i][this.key]] = posArr.concat([obj.children.length - 1]);
          data.splice(i, 1);
          i--;
        }
      }
      i++;
      if (i > data.length - 1) {
        i = 0;
      }
    }
    return tree;
  }
  this.copy = function(item) {
    var _temp = {
      children: []
    };
    _temp[this.treeKey] = item[this.key];
    for (var _index in item) {
      if (_index != this.key && _index != this.parentKey) {
        var _property = item[_index];
        if ((!!this.map) && this.map[_index])
          _temp[this.map[_index]] = _property;
        else
          _temp[_index] = _property;
      }
    }
    return _temp;
  }
}

function getDefalutResponse(response) {
  if (response.status === '200') {
    response.result = true
    response.json = response.data
  } else {
    response.result = false
  }
  return response
}

function showToast(obj) {
  var base = {
      title: '',
      image: '',
      duration: 1500,
      mask: true
    },
    param;

  param = Object.assign(base, obj || {})
  wx.showToast(param)
}

function unLoginToast(cancelUrl) {//未登录的情况下弹窗
  wx.showModal({
    title: '提示',
    content: '请前往绑定手机号后使用该功能',
    confirmText: "绑定",
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/user/login/login'
        })
      } else if (res.cancel) {
        if (cancelUrl)
        {
          wx.navigateTo({
            url: cancelUrl
          })
        }
      }
    }
  })
}

function initBase() {
  //初始加载用户验证、多选列表数据
  var pro = []
  pro.push(new Promise(function(resolve, reject) {
    wx.login({ //用户是否注册绑定手机号
      success(res) {
        app.wxCode = res.code;
        ajax({
          url: '/Login/IsLogin',
          data: {
            code: res.code
          }
        }).then((res) => {
          var data = res.data;
          if (res.data.status == 200) {
            app.token_type = data.data.token_type
            app.access_token = data.data.access_token
            app.userName = data.data.username
            app.isUum = data.data.isuum
            resolve(true)
          } else {
            resolve(false)
          }
        })
      }
    })
  }))
  pro.push(new Promise(function(resolve, reject) {
    ajax({
      url: '/App/GetSessionID'
    }).then((res) => {
      app.sessionid = res.data.data
      resolve(true)
    })
  }))
  pro.push(new Promise(function(resolve, reject) {
    ajax({
      url: '/xcxconfig.json'
    }).then((res) => {
      var data = res.data
      for (let x in data) {
        app.option[x] = data[x]
      }
      resolve(true)
    })
  }))
  pro.push(new Promise(function(resolve, reject) {
    ajax({
      url: '/Search/GetData?method=Web.XCX_GetArea'
    }).then((res) => {
      app.option['area'] = res.data.data.data
      resolve(true)
    })
  }))
  pro.push(new Promise(function(resolve, reject) {
    ajax({
      url: '/Search/GetData?method=Web.XCX_GetType'
    }).then((res) => {
      app.option['trade'] = res.data.data.data
      resolve(true)
    })
  }))
  return Promise.all(pro)
}
module.exports = {
  DateFormat,
  ajax,
  treeUtil,
  getDefalutResponse,
  showToast,
  unLoginToast,
  host,
  initBase
}
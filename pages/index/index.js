// 天气对应的color
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

// 中文与英文的转换  
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

// 定位权限类型
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

// 定位权限提示
const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = "点击获取当前位置"

// 腾讯地图SDK
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
/**
 *  此页面的生命周期
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowTemp: '0°',
    nowWeather: '晴天',
    nowWeatherBg: '/images/sunny-bg.png',
    forecast: [],
    todayTime: "",
    todayTemp: "",
    city: "上海市",
    locationTipText: UNPROMPTED_TIPS,
    locationAuthorized: UNPROMPTED,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onLoad')
    var that = this
    this.getLocation()
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: 'UQ3BZ-BRXKV-HIDPX-U7BSZ-HJ6Q7-RMBDJ'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide')

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload')

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh')
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log('onShareAppMessage')
  },
  /**
   *  获取现在的天气情况
   */
  getNow(callback) {
    var that = this
    wx.request({
      url: "https://test-miniprogram.com/api/weather/now", // 天气API
      data: {
        city: that.data.city
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let result = res.data.result
        // console.log(result)
        that.setNow(result)
        that.setHourlyWeather(result)
        that.setToday(result)
      },
      complete: () => { // 无论request 成功还是失败都会调用此方法
        // 关闭下拉刷新
        callback && callback()
      }
    })
  },
  /**
   *  设置 nowWeather
   */
  setNow(result) {
    let weather = result.now.weather
    let temp = result.now.temp
    // 更新界面
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBg: '/images/' + weather + '-bg.png',
    })
    // 设置 NavigationBarColor
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },

  /**
   *  设置24小时温度
   */
  setHourlyWeather(result) {
    // 天气预测
    let nowHour = new Date().getHours()
    let forecast_local = result.forecast
    for (var i = 0; i < forecast_local.length; i++) {
      forecast_local[i].time = (nowHour + i * 3) % 24 + '时'
      let weather = forecast_local[i].weather
      forecast_local[i].weather = '/images/' + weather + '-icon.png'
      let temp = forecast_local[i].temp
      forecast_local[i].temp = temp + '°'
      // console.log(forecast_local[i])
    }
    forecast_local[0].time = "现在"
    this.setData({
      forecast: forecast_local
    })
  },

  /**
   *  设置今天的时间和最高最低温度
   */
  setToday(result) {
    let today = result.today
    let date = new Date()
    this.setData({
      todayTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`,
      todayTemp: `${today.minTemp}° - ${today.maxTemp}°`
      // todayTemp: today.minTemp + '° - ' + today.maxTemp + '°'
    })
  },

  /**
   *  weather-today 视图的点击事件
   */
  onTodayWeatherTap() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city,
    })
  },

  /**
   *  location-wrapper 视图的点击事件
   */
  onTapLocation() {
    var that = this
    if (this.data.locationAuthorized === UNAUTHORIZED) {
      wx.getSetting({
        success(res) { // 从设置页面回调
          var userLocation = res.authSetting['scope.userLocation']
          if (userLocation) {
            that.getLocation()
          }
        }
      })
    } else {
      that.getLocation()
    }
    
  },

  /**
   *  获取定位信息
   */
  getLocation() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          locationTipText: AUTHORIZED_TIPS,
          locationAuthorized: AUTHORIZED
        })
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(res)

        that.qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res1) {
            //成功后的回调
            console.log(res1)
            that.setData({
              city: res1.result.address_component.city
            })
            that.getNow()
          }
        })
      },
      fail() {
        that.setData({
          locationTipText: UNAUTHORIZED_TIPS,
          locationAuthorized: UNAUTHORIZED,
          city: '北京市'
        })
        that.getNow()
      }
    })
  }
})
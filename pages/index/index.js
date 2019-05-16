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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNow();
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
    console.log("xiala")
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
 *  获取现在的天气情况
 */
  getNow(callback){
    var that = this
    wx.request({
      url: "https://test-miniprogram.com/api/weather/now", // 天气API
      data: {
        city: "重庆市"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let result = res.data.result
        console.log(result)
        that.setNow(result)
        that.setHourlyWeather(result)   
      },
      complete: () => {  // 无论request 成功还是失败都会调用此方法
        // 关闭下拉刷新
        callback && callback()
      }
    })
  },
  /**
   *  设置 nowWeather
   */
  setNow(result){
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
  setHourlyWeather(result){
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
  }
})
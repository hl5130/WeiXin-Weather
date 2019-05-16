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
    nowWeatherBg: '/images/sunny-bg.png'
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
        city: "上海市"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let result = res.data.result
        let now = res.data.result.now
        let temp = res.data.result.now.temp
        let weather = res.data.result.now.weather
        let weather_chinese = weatherMap[weather]

        console.log(res.data)
        console.log(result)
        console.log(now)
        console.log(temp)
        console.log(weather)

        // 更新界面
        that.setData({
          nowTemp: temp + '°',
          nowWeather: weather_chinese,
          nowWeatherBg: '/images/' + weather + '-bg.png'
        })
        // 设置 NavigationBarColor
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },
      complete: () => {  // 无论request 成功还是失败都会调用此方法
        // 关闭下拉刷新
        callback && callback()
      }
    })

  }
})
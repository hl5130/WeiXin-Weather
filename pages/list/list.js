
// 中文与英文的转换  
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

// 星期转换
const dayMap = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  0: '星期日'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateWeathers:[],
    city: "上海市"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    this.data.city = options.city
    this.requesData()
  },

  requesData(callBack){
    var that = this
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: that.data.city,
        time: new Date().getTime()
      },
      success(res) {
        // console.log(res.data.result)
        let dateWeather_local = []
        let result = res.data.result
        for (var i = 0; i < result.length; i++) {
          let date = new Date()
          date.setDate(date.getDate() + i)
          dateWeather_local.push({
            weather: weatherMap[result[i].weather],
            weather_icon: "/images/" + result[i].weather + "-icon.png",
            temp: `${result[i].minTemp}° - ${result[i].maxTemp}°`,
            day: dayMap[date.getDay() % 7],
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          })
        }
        dateWeather_local[0].day = '今天'
        console.log(dateWeather_local)
        that.setData({
          dateWeathers: dateWeather_local
        })
      },
      complete: ()=>{
        callBack && callBack()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    this.requesData(()=>{
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('onShareAppMessage')
  }
})
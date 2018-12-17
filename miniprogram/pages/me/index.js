import {
  request,
  cloudCall,
  scanCode,
  showToast
} from '../../utils/index.js'
import config from '../../config.js'
var isbn
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/images/user-unlogin.png',
    nickName: '点击登录',
    userInfo: {}
  },
  onGotUserInfo: function (e) {
    let userInfo = e.detail.userInfo
    // 不需要判断有没有登录，因为出现点击登录文字就表示需要登录
    if (!userInfo.openId) {
      cloudCall(
        'login',
        userInfo,
      )
        .then(res => {
          // 合并openId
          userInfo = Object.assign({}, userInfo, {
            openId: res.result.openId
          })
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            userInfo
          })
          showToast('登录成功')
        }, err => {
          showToast('登录失败')
        })
    }
  },
  onScanCode: function () { 
    scanCode()
      .then(res => {
        isbn = res.result
        return request(`${config.baseUrl}book/isbn/${isbn}`)
      })
      .then(res => {
        if(res.msg && res.code) {
          return res.msg
        }
        let result = res
        const tags = result.tags ? (
          result.tags.map(v => {
            return `${v.title} ${v.count}`
          }).join(',')
        ) : ''
        const book = {
          isbn,
          title: result.title,
          imageUrl: result.images ? result.images.large : {},
          alt: result.alt,
          publisher: result.publisher,
          summary: result.summary,
          price: result.price,
          rating: result.rating ? result.rating.average : 0,
          tags,
          author: result.author.join(','),
          count: 0,
          avatarUrl: this.data.avatarUrl,
          nickName: this.data.nickName,
        }
        return cloudCall('addBook', book)
      })
      .then(res => {
        if (res.msg) {
          showToast('出现请求错误')
          return 
        }
        if (res.result.code === 0) {
          showToast(res.result.data.title +'\n'+ res.result.data.msg)
        }else {
          showToast(res.result.data.msg)
        }
      }, err => {
        console.log(err)
        showToast(err)
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 获取缓存
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        userInfo
      })
    } else {
      this.setData({
        avatarUrl: '/images/user-unlogin.png',
        nickName: '点击登录',
        userInfo: {}
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
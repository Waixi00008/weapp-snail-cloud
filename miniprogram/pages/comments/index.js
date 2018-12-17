import { cloudCall } from '../../utils/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn: '',
    userInfo: {},
    comments: [],
    books: []
  },
  init() {
    // loading 需要同步函数才行，即只有执行了前面的，后面的才能执行
    wx.showNavigationBarLoading()
    this.getComments()
    this.getBooks(1)
    wx.hideNavigationBarLoading()
  },
  getComments() {
    cloudCall('comments', { openId: this.data.userInfo.openId })
      .then(res => {
        if (res.result.code === 0) {
          this.setData({
            comments: res.result.data.list
          })
        }
      })
  },
  // type === 1 个人图书 type ===2  图书详情
  getBooks: function (type) {
    let data = {}
    if (type === 1) {
      data = { openId: this.data.userInfo.openId }
    } else if (type === 2) {
      data = { isbn: this.data.isbn }
    }
    cloudCall('books', { openId: this.data.userInfo.openId })
      .then((res) => {
        if (res.result.code === 0) {
          this.setData({
            books: res.result.data.list
          })
        }
      })
  },
  onbookTap: function (e) {
    const isbn = e.detail.isbn
    wx.navigateTo({
      url: `/pages/bookDetail/index?isbn=${isbn}`
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
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.openId) {
      this.setData({
        userInfo
      })
      this.init()
    }else {
      this.setData({
        isbn: '',
        userInfo: {},
        comments: [],
        books: []
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
    this.init()
    // init不能够保证先执行完才执行stopPullDownRefresh
    // wx.stopPullDownRefresh()
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
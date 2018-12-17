import {
  request,
  cloudCall,
  showToast
} from '../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tops: [],
    books: [],
    page: 0,
    more: false,
    noData: false
  },
  getTop: function () {
    cloudCall('tops')
      .then((res) => {
        if (res.result.code === 0) {
          this.setData({
            tops: res.result.data.list
          })
        }
      })
  },
  getList: function (first) {
    if (first) {
      this.setData({
        page: 0,
        more: false
      })
    }
    wx.showNavigationBarLoading()
    cloudCall('books',{
      page: this.data.page
    })
      .then((res) => {
        if (res.result.code === 0) {
          const books = res.result.data.list
          if (first) {
            this.setData({
              books: books,
            })
            wx.stopPullDownRefresh()
          } else {
            if (books.length < 10 && this.data.page > 0) {
              this.setData({
                more: false
              })
            } else {
              console.log('111')
              this.setData({
                more: true
              })
            }
            // 下拉刷新，不能直接覆盖books 而是累加
            this.setData({
              books: this.data.books.concat(books)
            })
          }
        }
      })
    wx.hideNavigationBarLoading()
  },
  onbookTap: function (e) {
    // detail是从组件传过来的值
    const isbn = e.currentTarget.dataset.isbn || e.detail.isbn
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
    this.getTop()
    this.getList(true)
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
    this.getTop()
    // bug 因为不是同步的，刷新没完成，有可能触发onReachBottom事件
    // 最好能用async await
    this.getList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.more) {
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    this.getList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
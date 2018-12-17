import { cloudCall, showToast, getLocation, request } from '../../utils/index'
import config from '../../config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: '', //即isbn
    book: [],
    location: '',
    phone: '',
    userInfo: {},
    comment: '',
    comments: [],
    isComment:false
  },
  getBook: function (isbn) {
    cloudCall('books', { isbn: isbn })
      .then((res) => {
        if (res.result.code === 0) {
          this.setData({
            book: res.result.data.list[0]
          })
        }
        wx.setNavigationBarTitle({
          title: this.data.book.title
        })
      })
  },
  getGeo(e) {
    if (e.detail.value) {
      getLocation()
        .then(res => {
          return request(config.mapUrl, {
            data: {
              ak: config.ak,
              location: `${res.latitude},${res.longitude}`,
              output: 'json'
            }
          })
        }, err => {
          this.setData({
            location: '未知地点'
          })
        })
        .then(res => {
          if ((res.status === 0)) {
            this.setData({
              location: res.result.addressComponent.city
            })
          } else {
            this.setData({
              location: '未知地点'
            })
          }
        })
    } else {
      this.setData({
        location: ''
      })
    }
  },
  getPhone(e) {
    if (e.detail.value) {
      const phone = wx.getSystemInfoSync()
      this.setData({
        phone: phone.model
      })
    } else {
      this.setData({
        phone: ''
      })
    }
  },
  addComment() {
    let commentData = {
      openId: this.data.userInfo.openId,
      nickName: this.data.userInfo.nickName,
      avatarUrl: this.data.userInfo.avatarUrl,
      bookId: this.data.bookId,
      comment: this.data.comment,
      phone: this.data.phone,
      location: this.data.location
    }
    // 注意其实每个集合都会自动添加userInfo信息
    // 因此可以不必要添加openId
    cloudCall('addComment', commentData)
      .then(res => {
        if (res.result.code === 0) {
          showToast(res.result.data.msg)
          this.setData({
            comment: '',
            location: '',
            phone: ''
          })
          this.getComments()
        }
      }, err => {
        showToast(res.result.data.msg)
      })
  },
  bindformSubmit(e) {
    if (e.detail.value.textarea) {
      this.setData({
        comment: e.detail.value.textarea
      })
      this.addComment()
    }else {
      showToast('请输入评论内容')
    }
  },
  getComments() {
    cloudCall('comments', { bookId: this.data.bookId})
      .then(res => {
        if (res.result.code === 0) {
          this.setData({
            comments: res.result.data.list
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      bookId: options.isbn
    })
    this.getBook(options.isbn)
    this.getComments()
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
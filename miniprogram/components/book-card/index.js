// components/book-card/index.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    books: Array
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function (e) {
      const isbn = e.currentTarget.dataset.isbn
      this.triggerEvent('bookTap', {isbn})
    },
    onPreview: function (e) {
      let img = e.currentTarget.dataset.imageurl
      wx.previewImage({
        current: img,
        urls: [img],
      })
    }
  }
})

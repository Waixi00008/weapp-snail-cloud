export function request(url, params = {}) {
  return new Promise((reslove, reject) => {
    wx.request({
      url,
      method: params.method || 'GET',
      data: params.data || {},
      header: {
        'Content-Type': 'json'
      },
      success: res => {
        if (res.data) {
          reslove(res.data)
        } else {
          reject(res.errMsg)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export function cloudCall(name, data = {}) {
  return new Promise((reslove, reject) => {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: res => {
        reslove(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export function scanCode() {
  return new Promise((reslove, reject) => {
    wx.scanCode({
      success: res => {
        reslove(res)
      },
      // fail: err => {
      //   reject(err)
      // }
    })
  })
}

export function getLocation() {
  return new Promise((reslove,reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        reslove(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export function showToast(title, icon = 'none') {
  wx.showToast({
    icon,
    title
  })
}

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()
const db = cloud.database()
exports.main =async (event, context) => {
  const wxContext = await cloud.getWXContext()
  const data = Object.assign({}, event , {
    openId: event.userInfo.openId
  })

  try {
    // 先查找
    await db.createCollection('userInfo')
    const result = await db.collection('userInfo').where({
      openId: wxContext.OPENID,
    }).get()

    if (result.data.length) {
      return {
        openId: wxContext.OPENID,
        code: 0,
        data: {
          msg: '登录成功'
        }
      }
    }

    // 如果数据库有了, 就不添加
    await db.collection('userInfo').add({
      data: data
    })
    return {
      openId: wxContext.OPENID,
      code: 0,
      data: {
        title: event.title,
        msg: '登录成功'
      }
    }
  } catch (e) {
    return {
      code: -1,
      data: {
        msg: '登录失败:' + e
      }
    }
  }
}

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    await db.createCollection('comments')
    await db.collection('comments').add({
      data: {
        ...event,
        created_at: db.serverDate(),
        updated_at: db.serverDate()
      }
    })
    return {
      code: 0,
      data: {
        msg: '评论添加成功'
      }
    }
  } catch (e) {
    return {
      code: -1,
      data: {
        msg: '评论添加失败:' + e
      }
    }
  }
}
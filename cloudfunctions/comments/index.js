// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const { bookId, openId} = event
  const page = event.page || 0
  const size = event.size || 10

  await db.createCollection('comments')
  const mysqlSelect = db.collection('comments')
    .limit(size)
    .skip(page * size)
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')

  let comments

  if (bookId) {
    // 所有在本书的评论
    comments = await mysqlSelect.where({
      bookId: bookId
    }).get()
  } else if (openId) {
    // 个人所有评论
    comments = await mysqlSelect.where({
      openId: openId
    }).get()
  }

  return {
    code: 0,
    data: {
      list: comments.data
    }
  }
}
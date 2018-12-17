// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // 创建集合 await db.createCollection('books')
  const wxContext = cloud.getWXContext()
  // 先判断图书是否已存在
  const isbn = event.isbn || ''
  // 创建集合
  await db.createCollection('books')
  const result = await db.collection('books').where({
    isbn: isbn
  }).get()

  if (result.data.length) {
    return {
      code: -1,
      data: {
        msg: '图书已存在'
      }
    }
  }
  
  const data = {
    _openid: wxContext.OPENID,
    ...event,
    created_at: db.serverDate(),
    updated_at: db.serverDate()
  }

  // 返回结果
  try {
    await db.collection('books').add({
      data: data,
    })
    return {
      code: 0,
      data: {
        title: event.title,
        msg: '图书添加成功'
      }
    }
  } catch (e) {
    return {
      code: -1,
      data: {
        msg: '图书添加失败:' + e
      }
    }
  }
}
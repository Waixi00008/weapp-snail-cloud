// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const { isbn, openId } = event
  const page = event.page || 0
  const size = event.size || 10

  const mysqlSelect = db.collection('books')
    .limit(size)
    .skip(page * size)
    .orderBy('created_at', 'desc')
    .orderBy('id', 'desc')

  let books
  if (isbn) {
    books = await mysqlSelect.where({
      isbn: isbn
    }).get()

    // 点击详情 count+1
    try {
      await db.createCollection('books')
      await db.collection('books').where({
        isbn: isbn
      }).update({
        data: {
          count: db.command.inc(1)
        }
      })
    } catch (e) {
      console.error(e)
    }


  } else if (openId) {
    books = await mysqlSelect.where({
      _openid: openId
    }).get()
  } else {
    books = await mysqlSelect.get()
    console.log(page,size,books)
  }

  return {
    code: 0,
    data: {
      list: books.data
    }
  }
}
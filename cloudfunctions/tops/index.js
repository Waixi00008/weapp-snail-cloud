// 云函数入口文件
const cloud = require('wx-server-sdk')
const lodashArray = require('lodash/array')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // 默认取9条数据，根据count排序
  const num = event.num || 9
  await db.createCollection('books')
  let tops = await db.collection('books')
    .limit(num)
    .orderBy('count', 'desc')
    .orderBy('created_at', 'desc')
    .get()

  tops = lodashArray.chunk(tops.data, 3)

  return {
    code: 0,
    data: {
      list: tops
    }
  }
}
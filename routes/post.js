var express = require('express');
const dbconfig = require('../util/dbconfig');
var router = express.Router();

/* GET post listing. */
// 根据页数、当前页获取岗位列表
router.get('/', function (req, res, next) {
  let sql = "select * from userInfo";
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    res.send(data)
    // console.log(fields);
  }

  dbconfig.query(sql, sqlArr, callBack);
  //  res.send('respond with a resource');
});


// 获取我的岗位
router.get('/postOwn', function (req, res, next) {
  let userId = req.query.userId
  console.log(req.query)
  let sql = `select * from postInfo where userId=${userId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    if (data.length > 0) {
      data.forEach((item) => {
        item['price'] = [item['price_low'], item['price_high']]
        item['need'] = [item['need_low'], item['need_high']]
      })
    }
    res.send(data)
  }
  dbconfig.query(sql, sqlArr, callBack);
})


// 获取岗位详情
router.get('/postDetail', function (req, res, next) {
  let postId = req.query.postId;
  console.log(req.query)
  let sql = `select * from postInfo where id=${postId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data)
    // 不存在该岗位
    if (data.length == 0) {
      res.send(data)
      return
    }
    console.log(data[0]);
    // 处理数据字段
    data[0]['time'] = data[0]['p_time']
    data[0]['price'] = [data[0]['price_low'], data[0]['price_high']]
    data[0]['need'] = [data[0]['need_low'], data[0]['need_high']]
    data[0]['require'] = data[0]['must']
    // 查找用户联系方式
    let sqlUser = `select name,tel,email from userInfo where id=${data[0]['userId']}`;
    let sqlArrUser = [];
    let callBackUser = (userInfo) => {
      if (userInfo.length > 0) {
        data.push(userInfo[0])
      }
      res.send(data)
    }
    dbconfig.query(sqlUser, sqlArrUser, callBackUser);
  }
  dbconfig.query(sql, sqlArr, callBack);
});
module.exports = router;
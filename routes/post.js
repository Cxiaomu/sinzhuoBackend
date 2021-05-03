var express = require('express');
const dbconfig = require('../util/dbconfig');
var router = express.Router();

/* GET post listing. */
// 根据页数、当前页获取岗位列表
router.get('/filter', function (req, res) {
  let {
    pageSize,
    nowPage
  } = req.query
  let sql = `select * from postinfo limit ${(nowPage-1)*pageSize}, ${pageSize}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    if (data.length > 0) {
      data.forEach((item) => {
        item['price'] = [item['price_low'], item['price_high']]
        item['need'] = [item['need_low'], item['need_high']]
      })
    }
    res.send(JSON.stringify(data))
  }
  dbconfig.query(sql, sqlArr, callBack);
});

// 岗位总数
router.get('/postTotal', function (req, res) {
  let sql = "select * from postinfo";
  let sqlArr = [];
  let callBack = (data) => {
    let resData = {
      total: data.length
    }
    console.log(data, "data")
    res.send(JSON.stringify(resData))
  }
  dbconfig.query(sql, sqlArr, callBack);
})

// 获取我的岗位
router.get('/postOwn', function (req, res, next) {
  let userId = req.query.userId
  console.log(req.query)
  let sql = `select * from postinfo where userId=${userId}`;
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
  let sql = `select * from postinfo where id=${postId}`;
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

// 新建岗位
router.post('/createPost', function (req, res, next) {
  let {
    userId,
    name,
    unit,
    price,
    education,
    experience,
    need,
    duty,
    require,
    address
  } = req.body
  console.log(req.body)
  let sql = `insert into postinfo(userId, name, unit,
    price_low, price_high, education, experience, need_low, need_high, duty, must, address) 
    values(${userId}, '${name}', '${unit}', ${price[0]}, ${price[1]}, '${education}',
    '${experience}', ${need[0]}, ${need[1]}, '${duty}', '${require}', '${address}')`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    let resData = {
      success: false,
      id: 0
    }
    if (data.affectedRows === 1) {
      resData.success = true
      resData.id = data.insertId
    }
    res.send(JSON.stringify(resData))
  }
  dbconfig.query(sql, sqlArr, callBack);
});


// 更新项目
router.post('/updatePost', function (req, res, next) {
  let {
    postId,
    userId,
    price,
    education,
    experience,
    need,
    duty,
    require,
    address
  } = req.body
  console.log(req.body)
  let sql = `update postinfo set price_low=${price[0]}, price_high=${price[1]}, education='${education}',
    experience='${experience}', need_low=${need[0]}, need_high=${need[1]}, duty='${duty}', must='${require}', address='${address}'
    where userId=${userId} AND id=${postId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    let resData = {
      success: false
    }
    if (data.affectedRows === 1) {
      resData.success = true
    }
    res.send(JSON.stringify(resData))
  }
  dbconfig.query(sql, sqlArr, callBack);
});


// 删除项目
router.get('/delPost', function (req, res, next) {
  let postId = req.query.postId
  console.log(req.query)
  let sql = `delete from postinfo where id=${postId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    let resData = {
      success: false
    }
    if (data.affectedRows === 1) {
      resData.success = true
    }
    res.send(JSON.stringify(resData))
  }
  dbconfig.query(sql, sqlArr, callBack);
});


module.exports = router;
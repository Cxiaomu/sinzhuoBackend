var express = require('express');
const dbconfig = require('../util/dbconfig');
var router = express.Router();

/* GET course listing. */
router.get('/', function(req, res, next) {
  let sql = "select * from userInfo";
  let sqlArr = [];
  let callBack =  (data, fields) => {
    console.log(data);
    res.send(data)
    // console.log(fields);
  }

  dbconfig.query(sql, sqlArr, callBack);
  // res.send('respond with a resource');
});


// 获取我的课程
router.get('/courseOwn', function (req, res, next) {
  let userId = req.query.userId
  console.log(req.query)
  let sql = `select id, name, author,unit,link,c_time from courseInfo where userId=${userId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    if (data.length > 0) {
      data.forEach((item) => {
        item['time'] = item['c_time']
      })
    }
    res.send(data)
  }
  dbconfig.query(sql, sqlArr, callBack);
})



// 获取课程详情
router.get('/courseDetail', function (req, res, next) {
  let courseId = req.query.courseId;
  console.log(req.query)
  let sql = `select * from courseInfo where id=${courseId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data)
    // 不存在该课程
    if (data.length == 0) {
      res.send(data)
      return
    }
    // 处理数据字段
    data[0]['time'] = data[0]['c_time']
    
    // 查找用户名字
    let sqlUser = `select name from userInfo where id=${data[0]['userId']}`;
    let sqlArrUser = [];
    let callBackUser = (userInfo) => {
      if (userInfo.length > 0) {
        data[0]['publisher'] = userInfo[0]['name']
      }
      res.send(data)
    }
    dbconfig.query(sqlUser, sqlArrUser, callBackUser);
  }
  dbconfig.query(sql, sqlArr, callBack);
});

// 新建课程
router.post('/createCourse', function (req, res, next) {
  let {
    userId,
    name,
    author,
    uint,
    link,
    abstract
  } = req.body
  console.log(req.body)
  let sql = `insert into courseInfo(userId, name, author, unit, link,  abstract) 
  values(${userId}, '${name}', '${author}', '${uint}', '${link}', '${abstract}')`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    let resData = { success: false }
    if (data.affectedRows === 1) {
      resData.success = true
    } 
    res.send(JSON.stringify(resData))
  }
  dbconfig.query(sql, sqlArr, callBack);
});


// 更新课程
router.post('/updateCourse', function (req, res, next) {
  let {
    courseId,
    userId,
    link,
    abstract
  } = req.body
  console.log(req.body)
  let sql = `update courseInfo set link='${link}', abstract='${abstract}'
  where userId=${userId} AND id=${courseId}`;
  let sqlArr = [];
  let callBack = (data) => {
    let resData = { success: false }
    if (data.affectedRows === 1) {
      resData.success = true
    } 
    res.send(JSON.stringify(resData))
  }
  dbconfig.query(sql, sqlArr, callBack);
});


// 删除课程
router.get('/delCourse', function (req, res, next) {
  let courseId = req.query.courseId
  console.log(req.query)
  let sql = `delete from courseInfo where id=${courseId}`;
  let sqlArr = [];
  let callBack = (data) => {
    let resData = { success: false }
    if (data.affectedRows === 1) {
      resData.success = true
    } 
    res.send(JSON.stringify(resData))
  }
  dbconfig.query(sql, sqlArr, callBack);
});


module.exports = router;

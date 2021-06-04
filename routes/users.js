var express = require('express');
const dbconfig = require('../util/dbconfig');
var router = express.Router();

/* GET users listing. */
// 登录接口
router.get('/login', function (req, res, next) {
  let {
    role,
    username,
    password
  } = req.query
  console.log(req.query)
  let sql = `select * from userInfo where username='${username}' AND password='${password}' AND role=${role}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    res.send(JSON.stringify(data))
  }

  dbconfig.query(sql, sqlArr, callBack);
});


// 注册接口
router.post('/register', function (req, res, next) {
  let {
    role,
    tel,
    password
  } = req.body
  console.log("req.body")
  console.log(req.body)
  let result = {
    success: false,
    exist: false
  }

  // 判断是否存在该用户
  let exist = false;
  let sqlCheck = `select * from userInfo where tel='${tel}'`;
  let sqlArrCheck = [];
  let callBackCheck = (data) => {
    console.log(data.length, "data.length")
    exist = data.length > 0 ? true : false
    console.log(exist, "exist")
    // 存在该用户 返回
    if (exist) {
      result.exist = true
      res.send(JSON.stringify(result))
      return
    }
    // 数据插入
    let sql = `insert into userInfo (username, password, role, tel) values('${tel}', '${password}', ${role}, '${tel}' )`;
    let sqlArr = [];
    let callBack = (data) => {
      if (data.serverStatus === 2) {
        result.success = true
        result.exist = false
      }
      res.send(JSON.stringify(result))
    }
    dbconfig.query(sql, sqlArr, callBack);
  };
  dbconfig.query(sqlCheck, sqlArrCheck, callBackCheck);
})


// 获取用户信息 根据id
router.get('/uerInfo', function (req, res, next) {
  let userId = req.query.userId;
  if (userId) {
    console.log(req.query)
    let sql = `select * from userInfo where id=${userId}`;
    let sqlArr = [];
    let callBack = (data) => {
      console.log(data)
      res.send(data)
    }
    dbconfig.query(sql, sqlArr, callBack);
  }
});


// 修改密码接口
router.post('/updatePwd', function (req, res, next) {
  let {
    id,
    oldPassword,
    newPassword
  } = req.body
  console.log("req.body")
  console.log(req.body)
  let result = {
    success: false,
    error: false
  }

  // 判断旧密码是否错误
  let error = false;
  let sqlCheck = `select * from userInfo where id=${id} AND password='${oldPassword}'`;
  let sqlArrCheck = [];
  let callBackCheck = (data) => {
    console.log(data.length, "data.length")
    error = data.length > 0 ? false : true
    console.log(error, "error")
    // 存在旧密码错误 返回
    if (error) {
      result.error = true
      res.send(JSON.stringify(result))
      return
    }
    // 数据更新
    let sql = `update userInfo set password='${newPassword}' where id=${id}`;
    let sqlArr = [];
    let callBack = (data) => {
      if (data.serverStatus === 2) {
        result.success = true
        result.error = false
      }
      res.send(JSON.stringify(result))
    }
    dbconfig.query(sql, sqlArr, callBack);
  };
  dbconfig.query(sqlCheck, sqlArrCheck, callBackCheck);
})


// 更新个人信息
router.post('/updateInfo', function (req, res, next) {
  let {
    id,
    name,
    sex,
    unit,
    department,
    tel,
    email,
    abstract
  } = req.body
  console.log(req.body)
  let sql = `update userInfo set name='${name}', sex='${sex}', unit='${unit}', department='${department}',
   tel='${tel}', email='${email}', abstract='${abstract}' where id=${id}`;
  let sqlArr = [];
  let callBack = (data) => {
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
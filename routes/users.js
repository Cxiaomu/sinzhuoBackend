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
  let sqlCheck = `select * from userInfo where username='${tel}'`;
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

module.exports = router;
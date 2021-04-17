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
  let callBack = (data, fields) => {
    console.log(data);
    res.send(JSON.stringify(data))
  }

  dbconfig.query(sql, sqlArr, callBack);
});

router.post('/register', function (req, res, next) {
  // let {
  //   role,
  //   username,
  //   password
  // } = req.body
  console.log("req.body")
  console.log(req.body)
  // console.log(role, username, password)
  // let sql = `insert into userInfo (username, password, role, tel) values(${username}, ${password}, ${role}, ${username} )`;
  // let sqlArr = [];
  // let callBack = (data, fields) => {
  //   console.log(data);
  //   res.send(JSON.stringify(data))
  // }

  // dbconfig.query(sql, sqlArr, callBack);
  res.send(req.body)
})
module.exports = router;
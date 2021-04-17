var express = require('express');
const dbconfig = require('../util/dbconfig');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  // 测试
  let sql = "select * from userInfo";
  let sqlArr = [];
  let callBack =  (data, fields) => {
    console.log(data);
    res.send(data)
    // console.log(fields);
  }

  dbconfig.query(sql, sqlArr, callBack);
  // 测试
  // res.render('index', { title: 'Express' });
});

module.exports = router;

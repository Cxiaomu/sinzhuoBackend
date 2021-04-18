var express = require('express');
const dbconfig = require('../util/dbconfig');
var router = express.Router();

/* GET project listing. */
router.get('/projectList', function(req, res, next) {
  let {
    role,
    username,
    password
  } = req.query
  console.log(req.query)
  // let sql = "select * from userInfo";
  // let sqlArr = [];
  // let callBack =  (data, fields) => {
  //   console.log(data);
  //   res.send(data)
  //   // console.log(fields);
  // }

  // dbconfig.query(sql, sqlArr, callBack);
  res.send('respond with a resource');
});

module.exports = router;

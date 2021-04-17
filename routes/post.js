var express = require('express');
const dbconfig = require('../util/dbconfig');
var router = express.Router();

/* GET post listing. */
router.get('/', function(req, res, next) {
  let sql = "select * from userInfo";
  let sqlArr = [];
  let callBack =  (data, fields) => {
    console.log(data);
    res.send(data)
    // console.log(fields);
  }

  dbconfig.query(sql, sqlArr, callBack);
  res.send('respond with a resource');
});

module.exports = router;

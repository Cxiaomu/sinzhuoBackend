var express = require('express');

const dbconfig = require('../util/dbconfig');
const menuList = require('../public/json/menu.json')
const projectList = require('../public/json/project.json')

var router = express.Router();
/* GET home page. */
router.get('/menuList', function (req, res, next) {
  res.json({
    errno: 0,
    data: menuList.menu
  })
});

router.get('/navList', function (req, res, next) {
  res.json({
    errno: 0,
    data: menuList.nav
  })
});

router.get('/projectPhase', function (req, res, next) {
  res.json({
    errno: 0,
    data: projectList.phaseList
  })
});

router.get('/projectField', function (req, res, next) {
  res.json({
    errno: 0,
    data: projectList.fieldList
  })
});

module.exports = router;
var express = require('express');
const multer = require('multer'); // 处理上传图片
const path = require('path');
const dbconfig = require('../util/dbconfig');
var router = express.Router();
const projectList = require('../public/json/project.json')

/* GET project listing. */
// 获取项目列表

router.get('/filter', function (req, res, next) {
  let {
    financing,
    phase,
    field,
    pageSize,
    nowPage
  } = req.query
  console.log(req.query)
  let subSQL1 = '';
  let subSQL2 = '';
  let subSQL3 = '';
  
  // 是否融资
  if (financing == '1') { // 是
    subSQL1 = ` where financing=1 `
  } else if (financing == '0') { // 否
    subSQL1 = ` where financing=0 `
  }
  // 项目阶段
  if (phase != '0') {
    console.log(phase)
    if (subSQL1) {
      subSQL2 = ` AND `
    } else
      subSQL2 = ` where `
    subSQL2 += ` phase=${phase} `
  }

  // 项目领域
  if (field != '0') {
    console.log(field)
    if (subSQL1 || subSQL2) {
      subSQL3 = ' AND '
    } else
      subSQL3 = ' where '
    subSQL3 += ` field=${field} `
  }

  // let sql = `select * from projectinfo ${subSQL1+subSQL2+subSQL3} limit ${nowPage-1}, ${pageSize}`
  let sql = `select * from projectinfo ${subSQL1+subSQL2+subSQL3} `
  let sqlArr = [];
  let callBack =  (data) => {
    console.log(sql)
    console.log(data)
    let result = {
      total: data.length,
      list: {}
    }
    if (data.length > 0) {
      let end = (nowPage+1)*pageSize+1 > data.length ? data.length:(nowPage+1)*pageSize+1
      result.list = data.slice([(nowPage-1)*pageSize], end);
      result.list.forEach((item) => {
        projectList.phaseList.forEach((phase) => {
          if (phase.id == item['phase']) {
            item['phase'] = phase.name;
          }
        })
        projectList.fieldList.forEach((field) => {
          if (field.id == item['field']) {
            item['field'] = field.name;
          }
        })
      })
    }
    res.send(result)
  }

  dbconfig.query(sql, sqlArr, callBack);
  // res.send('respond with a resource');
});


// 根据关键字搜索
router.get('/keywords', function (req, res, next) {
  let keywords = req.query.keywords
  console.log(req.query)
  let sql = `select * from projectinfo where (name LIKE '%${keywords}%' or abstract LIKE '%${keywords}%')`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    console.log(sql)
    if (data.length > 0) {
      data.forEach((item) => {
        projectList.phaseList.forEach((phase) => {
          if (phase.id == item['phase']) {
            item['phase'] = phase.name;
          }
        })
        projectList.fieldList.forEach((field) => {
          if (field.id == item['field']) {
            item['field'] = field.name;
          }
        })
      })
    }
    res.send(data)
  }
  dbconfig.query(sql, sqlArr, callBack);
})

// 获取我的项目
router.get('/projectOwn', function (req, res, next) {
  let userId = req.query.userId
  console.log(req.query)
  let sql = `select id, name, phase, field from projectinfo where userId=${userId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data);
    if (data.length > 0) {
      data.forEach((item) => {
        projectList.phaseList.forEach((phase) => {
          if (phase.id == item['phase']) {
            item['phase'] = phase.name;
          }
        })
        projectList.fieldList.forEach((field) => {
          if (field.id == item['field']) {
            item['field'] = field.name;
          }
        })
      })
    }
    res.send(data)
  }
  dbconfig.query(sql, sqlArr, callBack);
})


// 获取项目详情
router.get('/projectDetail', function (req, res, next) {
  let projectId = req.query.projectId;
  console.log(req.query)
  let sql = `select * from projectinfo where id=${projectId}`;
  let sqlArr = [];
  let callBack = (data) => {
    console.log(data)
    // 不存在该项目
    if (data.length == 0) {
      res.send(data)
      return
    }
    data[0]['time'] = data[0]['p_time']
    // 处理项目阶段、项目领域
    projectList.phaseList.forEach((item) => {
      if (item.id == data[0]['phase']) {
        data[0]['phase'] = item.name;
      }
    })
    projectList.fieldList.forEach((item) => {
      if (item.id == data[0]['field']) {
        data[0]['field'] = item.name;
      }
    })
    console.log(data[0]);
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


// 新建项目
router.post('/createProject', function (req, res, next) {
  let {
    userId,
    name,
    imgUrl,
    field,
    phase,
    financing,
    abstract
  } = req.body
  console.log(req.body)
  let sql = `insert into projectinfo(userId, name, imgUrl, field, phase, financing,  abstract) 
  values(${userId}, '${name}', '${imgUrl}', ${field}, ${phase}, ${financing}, '${abstract}')`;
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


// 更新项目
router.post('/updateProject', function (req, res, next) {
  let {
    projectId,
    imgUrl,
    phase,
    financing,
    abstract,
    userId
  } = req.body
  console.log(req.body)
  let sql = `update projectinfo set imgUrl='${imgUrl}', phase=${phase}, financing=${financing}, abstract='${abstract}'
  where userId=${userId} AND id=${projectId}`;
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


// 删除项目
router.get('/delProject', function (req, res, next) {
  let projectId = req.query.projectId
  console.log(req.query)
  let sql = `delete from projectinfo where id=${projectId}`;
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

// 图片存储配置
var storage = multer.diskStorage({
  // 配置文件上传后存储的路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/uploads'))
  },
  // 配置文件上传后存储的路径和文件名
  filename: function (req, file, cb) {
    console.log('file', file);
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({
  storage: storage
})


// 上传项目logo
router.post('/projectLogo', upload.single("file"), function (req, res) {
  let imgUrl = req.file.filename;
  console.log(req.file)
  let data = [{
    name: req.file.originalname,
    url: "http://localhost:3000/project/projectImg?imgName=" + req.file.filename
  }]

  res.send(JSON.stringify(data))
});

// 读取图片
router.get('/projectImg', function (req, res) {
  let filename = req.query.imgName;
  let url = path.join(__dirname, '../public/images/uploads/')
  res.sendFile(url + filename)
});

module.exports = router;
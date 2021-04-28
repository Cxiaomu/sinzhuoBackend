var express = require('express');
const multer = require('multer'); // 处理上传图片
const path = require('path');
const dbconfig = require('../util/dbconfig');
var router = express.Router();
const projectList = require('../public/json/project.json')

/* GET project listing. */
// 获取项目列表
router.get('/projectList', function (req, res, next) {
  let params = {
    financing,
    phase,
    field,
    pageSize,
    nowPage
  } = req.query
  let sql = "select * from userInfo where "
  console.log(req.query)
  for (let key in params) {
    // if (params[key] != null)
  }
  // let sql = "select * from userInfo";
  // let sqlArr = [];
  // let callBack =  (data) => {
  //   console.log(data);
  //   res.send(data)
  //   // console.log(fields);
  // }

  // dbconfig.query(sql, sqlArr, callBack);
  res.send('respond with a resource');
});


// 获取我的项目
router.get('/projectOwn', function (req, res, next) {
  let userId = req.query.userId
  console.log(req.query)
  let sql = `select id, name, phase, field from projectInfo where userId=${userId}`;
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
  let sql = `select * from projectInfo where id=${projectId}`;
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
  let sql = `insert into projectInfo(userId, name, imgUrl, field, phase, financing,  abstract) 
  values(${userId}, '${name}', '${imgUrl}', ${field}, ${phase}, ${financing}, '${abstract}')`;
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
  let sql = `update projectInfo set imgUrl='${imgUrl}', phase=${phase}, financing=${financing}, abstract='${abstract}'
  where userId=${userId} AND id=${projectId}`;
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


// 删除项目
router.get('/delProject', function (req, res, next) {
  let projectId = req.query.projectId
  console.log(req.query)
  let sql = `delete from projectInfo where id=${projectId}`;
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

// 图片存储配置
var storage = multer.diskStorage({
  // 配置文件上传后存储的路径
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/images/uploads'))
  },
  // 配置文件上传后存储的路径和文件名
  filename: function (req, file, cb) {
      console.log('file',file);
      cb(null, Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage })


// 上传项目logo
router.post('/projectLogo', upload.single("file"), function (req, res) {
  let imgUrl = req.file.filename;
  console.log(req.file)
  let data = [
      {
        name: req.file.originalname,
        url: "http://localhost:3000/project/projectImg?imgName="+ req.file.filename
      }
  ]
  
  res.send(JSON.stringify(data))
});

// 读取图片
router.get('/projectImg', function (req, res) {
  let filename = req.query.imgName;
  let url = path.join(__dirname,'../public/images/uploads/')
  res.sendFile(url+filename)
});

module.exports = router;
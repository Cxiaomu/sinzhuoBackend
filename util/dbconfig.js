const mysql = require('mysql')

// 数据库配置
const dbconfig = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1302491phpstudy',
  database: 'sinzhuo'
}

module.exports = {
  query: function (sql, sqlArr, callback) {
    // 建立连接
    let conn = mysql.createConnection(dbconfig);

    conn.connect(function (err) {
      // 连接失败
      if (err) {
        console.log('数据库链接失败');
        throw err;
      }

      // 执行数据库操作
      conn.query(sql, sqlArr, function (err, data, fields) {
        // 数据库操作失败
        if (err) {
          console.log('数据库操作失败');
          throw err;
        }
        
        // 执行回调函数
        // console.log(data)
        // console.log(fields)
        callback && callback(JSON.parse(JSON.stringify(data)));

        // 关闭数据库
        conn.end((err) => {
          if (err) {
            console.log('关闭数据库连接失败！');
            throw err;
          }
        })
      })
    })
  }
}
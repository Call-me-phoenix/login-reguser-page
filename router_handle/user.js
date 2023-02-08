//导入数据库的操作模块
const db = require('../db/index')
//导入bcryptjs
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')
//导入配置文件
const config = require('../config')

//注册新用户
exports.regUser = (req, res) => {
    // res.send('注册用户接口OK！')
    //1.判断用户名或者密码是否为空
    //接收表单数据
    const userinfo = req.body
    //判断数据是否合法
    // if (!userinfo.username || !userinfo.password) {
    //     return res.cc('用户名或密码不合法！')
    // }
    //2.检测用户名是否被占用 
    //定义查询语句
    const sql = `select * from ev_users where username=?`
    //执行sql语句并根据结果判断用户名是否被占用
    db.query(sql, [userinfo.username], function (err, results) {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名')
        }
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) {
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试')
            }
            res.send({ status: 0, message: '注册成功！' })
        })
    })
}

//登录
exports.login = (req, res) => {
    //请求表单数据
    const userinfo = req.body
    //定义sql语句
    const sql = 'select * from ev_users where username=?'
    //执行sql语句，查询用户的数据
    db.query(sql, userinfo.username, function (err, results) {
        //执行sql语句失败
        if (err) return res.cc(err)
        //执行sql语句成功，但是查询到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败,用户名不存在！')
        //判断密码是否正确
        //拿用户输入的密码，和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('密码错误！请重新输入！')
        const user = { ...results[0], password: '', user_pic: '' }
        //对用户信息进行加密，生成一个token
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h'
        })
        res.send({
            status: 0,
            message: '登录成功！',
            //方便用户端直接使用token，在服务器端直接拼接Bearer前缀
            token: 'Bearer' + tokenStr
        })
    })
}
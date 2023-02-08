//导入express模块
const express = require('express')
//导入cors中间件
const cors = require('cors')
//创建express的服务器实例
const app = express()
//导入配置文件
const config = require('./config')
//解析token的中间件
const expressJWT = require('express-jwt')
//将cors注册为全局中间件
app.use(cors())
//配置解析表单数据的中间件  
app.use(express.urlencoded({ extended: false }))

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

//在所有路由之前封装res.cc()函数
app.use((req, res, next) => {
    //status的值默认为1，表示失败
    //err的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({ status, message: err instanceof Error ? err.message : err })
    }
    next()
})

//导入用户路由模块
const userRouter = require('./router/user')
//全局挂载用户路由
app.use('/api', userRouter)

const joi = require('joi')
app.use(function (err, req, res, next) {
    //数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    //未知错误
    res.cc(err)
})

app.get('', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})
//静态资源托管
app.use(express.static(__dirname + '/public'))
//调用app.listen方法，指定端口号并且启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})
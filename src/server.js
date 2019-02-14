const router = require('./router.js')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const createError = require('http-errors')
const socket = require('./socket/index')
const goods = require('./models/goods')

const app = express()

// const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '', '../public/')))
app.use(express.static(path.join(__dirname, '', '../views/public/')))
app.use(express.static(path.join(__dirname, '', '../uploads/')))
app.use(router)
app.use(morgan('dev'))

const server = app.listen(3000,() => {
  global['port'] = server.address().port;
  //goods.addGoods()
  console.log('server is running on port ' + server.address().port)
})

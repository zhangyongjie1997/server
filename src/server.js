const router = require('./router.js')
const express = require('express')
const https = require('https')
const http = require('http')
const path = require('path')
const fs = require('fs')
const cluster = require('cluster')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')

const app = express()
const numCPUs = require('os').cpus().length

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../https/cert.key'), 'utf8'),
  cert: fs.readFileSync(path.resolve(__dirname, '../https/cert.pem'), 'utf8')
}

const httpsServer = https.createServer(httpsOptions, app)
const httpServer = http.createServer(app)

// const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(router)
app.use(morgan('dev'))
app.use(session({
  secret: 'this is the secret for cookie',
  resave: true,
  saveUninitialized: true
}))

app.use('/public', express.static(path.resolve(__dirname, '../public/')))
app.use(express.static(path.resolve(__dirname, '../views/public/')))
app.use('/static', express.static(path.resolve(__dirname, '../uploads/')))


if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs - 3; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
}else{
  httpsServer.listen(3001, () => {
    global['port'] = httpsServer.address().port;
    console.log('httpsServer is running on port ' + httpsServer.address().port)
  })
  
  httpServer.listen(3000, () => {
    global['port'] = httpServer.address().port;
    console.log('httpServer is running on port ' + httpServer.address().port)
  })

  console.log(`工作进程 ${process.pid} 已启动`);
}

httpsServer.listen(3001, () => {
  global['port'] = httpsServer.address().port;
  console.log('httpsServer is running on port ' + httpsServer.address().port)
})

httpServer.listen(3000, () => {
  global['port'] = httpServer.address().port;
  console.log('httpServer is running on port ' + httpServer.address().port)
})

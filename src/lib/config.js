module.exports = {
  secret: 'chat',
  dbConfig: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test',
    port: '3306',
  },
  mongoConfig: {
    host: 'localhost',
    port: '21710',
    datebase: 'test',
    path: 'mongodb://localhost/test'
  },
  uploadPath: 'public/uploads/',
}
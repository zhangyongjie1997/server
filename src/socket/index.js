const io = require('socket.io')

class Socket {
  getSocket(server){
    return io.listen(server);
  }
}
module.exports = new Socket();
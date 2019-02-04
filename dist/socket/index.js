"use strict";
const io = require('socket.io');
const socket = {
    getSocket(server) {
        return io.listen(server);
    }
};
module.exports = socket;

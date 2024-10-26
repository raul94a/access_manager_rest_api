let io;



module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer,{extraHeaders:{'Access-Control-Allow-Origin':'https://192.168.13.18:8080'},cors:{origin:'*'}});
        
        return io;
    },
    getIO: () => {
        
        if(!io){
            throw new Error('Socket.io is not initialized')
        }
        return io;
    }
    
}

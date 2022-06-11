let io;



module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer,{extraHeaders:{'Access-Control-Allow-Origin':'https://localhost:8080'},cors:{origin:'*'}});
        
        return io;
    },
    getIO: () => {
        
        if(!io){
            throw new Error('Socket.io is not initialized')
        }
        return io;
    }
    
}

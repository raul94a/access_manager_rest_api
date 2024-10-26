const express = require('express');

const path = require('path')
const loadDatabase = require('./loaders/database-loader').initDatabase;
const app = express();



const authRoutes = require('./routes/auth');
const accessManagerDeviceRoutes = require('./routes/accessManagerDevice')
const accessRequestRoutes = require('./routes/accessRequest');
const userRoutes = require('./routes/userRoutes');

app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(__dirname + '/public'));
app.use('/storage', express.static(path.join(__dirname, 'storage')))
// app.use(
//     multer({ storage: storage, }).single('imageUrl')
//   );
//Mandatory to set express.json() in order to listen to post request
//in fact, what the statement does is to set the bodyparser to JSON format
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, JWT-AUTH, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    next();
})

app.use(authRoutes.authRoutes);
app.use(accessManagerDeviceRoutes.accessManagerDeviceRoutes);
app.use(accessRequestRoutes.router)
app.use(userRoutes.router);


loadDatabase().then((_) => {
    const serverLogger = require('./utils/logger').serverLogger;
    const server = app.listen(8080);
    serverLogger.info('Server started at port 8080');
    
    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log(`Client connected: ${socket.data}`)
    });
})

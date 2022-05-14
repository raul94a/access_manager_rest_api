const express = require('express');
const loadDatabase = require('./loaders/database-loader').initDatabase;
const app = express();

const authRoutes = require('./routes/auth');
const accessManagerDeviceRoutes = require('./routes/accessManagerDevice')
const accessRequestRoutes = require('./routes/accessRequest');

app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(__dirname + '/public'));

//Mandatory to set express.json() in order to listen to post request
//in fact, what the statement does is to set the bodyparser to JSON format
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, mytoken, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    next();
})

app.use(authRoutes.authRoutes);
app.use(accessManagerDeviceRoutes.accessManagerDeviceRoutes);
app.use(accessRequestRoutes.router)

loadDatabase().then((_) => {
  
    const server = app.listen(8080);

    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log('CLIENT CONNECTED')
    });
})

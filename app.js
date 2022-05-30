const express = require('express');
const path = require('path')
const loadDatabase = require('./loaders/database-loader').initDatabase;
const app = express();

const fileFilter = (req, file, cb) => {
    //CUIDADO CON EL FILE MIMETYPE 
    //HAY QUE DECLARAR EN ELC LIENTE EL TIPO DE ARCHVO!
    console.log(file.mimetype)
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
    } else {
        console.log('FILTERED OUT')
        cb(null, false);
    }
};


const authRoutes = require('./routes/auth');
const accessManagerDeviceRoutes = require('./routes/accessManagerDevice')
const accessRequestRoutes = require('./routes/accessRequest');
const userRoutes = require('./routes/userRoutes');

app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(__dirname + '/public'));
app.use('/storage', express.static(__dirname + '/storage'))
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
// app.put('/user/profile/update/picture', upload.single('imageUrl'),  async (req,res,next) => {
//     const file = req.file;
//     console.log(file);
// })

loadDatabase().then((_) => {
    
    const server = app.listen(8080);
    
    const io = require('./socket').init(server);
    io.on('connection', socket => {
        console.log('CLIENT CONNECTED')
    });
})

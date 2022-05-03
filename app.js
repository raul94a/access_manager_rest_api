const express = require('express');
const loadDatabase = require('./loaders/database-loader').initDatabase;
const app = express();

const authRoutes = require('./routes/auth');
const accessManagerDeviceRoutes = require('./routes/accessManagerDevice')

app.use(express.urlencoded({ extended: false }))
//Mandatory to set express.json() in order to listen to post request
//in fact, what the statement does is to set the bodyparser to JSON format
app.use(express.json());


app.use(authRoutes.authRoutes);
app.use(accessManagerDeviceRoutes.accessManagerDeviceRoutes);

loadDatabase().then((_) => {
    const server = app.listen(3000);

})

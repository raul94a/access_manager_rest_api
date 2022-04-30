const express = require('express');
const loadDatabase = require('./loaders/database-loader').initDatabase;
const app = express();


app.use(express.urlencoded({ extended: false }))
//compulsory to set express.json() in order to listen to post request
//in fact, what the statement does is to set the bodyparser to JSON format
app.use(express.json());


loadDatabase().then((_) => {
    const server = app.listen(3000);

})

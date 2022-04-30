const mongoose = require('mongoose');
const configDatabase = require('../config/database.json')

exports.initDatabase = async () =>{
    console.log(configDatabase.url)
    await mongoose.connect(configDatabase.url).catch((error)=>{
        console.log('An error has ocurred')
        console.log(error)
    });
}
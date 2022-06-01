const mongoose = require('mongoose');
const configDatabase = require('../config/env.json')
const dbLogger = require('../utils/logger').dbLogger;

exports.initDatabase = async () =>{
    // console.log(configDatabase.url)
    await mongoose.connect(configDatabase.url).catch((error)=>{
        console.log('An error has ocurred')
        console.log(error)
        dbLogger.error('MongoDB initialization has failed: ', error)
    });
    dbLogger.info('MongoDB has been started')
}
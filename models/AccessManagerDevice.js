const mongoose = require('mongoose');
const model = mongoose.model;
const Schema = mongoose.Schema;


const accessManagerDeviceSchema = new Schema({
    
    registrationCode: {
        type:String,
        required:true,
        unique:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    registered: Boolean,
    
})

const AccessManagerDevice = model('AccessManagerDevice', accessManagerDeviceSchema)
exports.AccessManagerDevice = AccessManagerDevice;
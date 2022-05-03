const mongoose = require ('mongoose');
//
const Schema = mongoose.Schema;


const deviceSchema = new Schema({
    androidId: String,
    manufacturer:String,
    model:String,
    brand:String,
    version: Number,
    device: String,
    isPhysicalDevice: Boolean,
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }

});

const DeviceInfo =  mongoose.model('DeviceInfo', deviceSchema);
exports.DeviceInfo = DeviceInfo;


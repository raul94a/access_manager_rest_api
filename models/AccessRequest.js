const mongoose = require('mongoose');
const model = mongoose.model;
const Schema = mongoose.Schema;


const accessRequestSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true
    },
    device:{
        type:Schema.Types.ObjectId,
        required:true
    },
    date:{
        type:Schema.Types.Date,
        required:true

    },
    success:{
        type:Boolean
    }
    
})

const AccessRequest = model('AccessRequest',accessRequestSchema);
exports.AccessRequest = AccessRequest;


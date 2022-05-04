const mongoose = require('mongoose');
const model = mongoose.model;
const Schema = mongoose.Schema;


const accessManagerDeviceDataSchema = new Schema({

    active: {
        required: true,
        type: Boolean
    },
    accessType: {
        required: true,
        type: String
    },
    device: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccessManagerDevice'
    },
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    allowedUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    address: String,
    lat: Number,
    long: Number

})

const AccessManagerDeviceData = model('AccessManagerDeviceData', accessManagerDeviceDataSchema);
exports.AccessManagerDeviceData = AccessManagerDeviceData;
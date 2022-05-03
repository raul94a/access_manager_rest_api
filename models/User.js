const mongoose = require ('mongoose');
//
const Schema = mongoose.Schema;


const userSchema = new Schema({
    uid:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
    },
    email: String,

});

const User =  mongoose.model('User', userSchema);
exports.User = User;


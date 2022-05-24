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
    imageUrl: String,
    email: String,
    firstName: String,
    lastName: String,
    birthDate: Date,
    mainAddress:String,
    secondaryAddress:String
    

});

const User =  mongoose.model('User', userSchema);
exports.User = User;


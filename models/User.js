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
    secondaryAddress:String,
    pictureVisibleBy:{
        default:'ALL',
        type:String,
        
    },
    showAMDLocation:{
        default: 'ALL',
        type: String
    },
    contacts: [String],
    blacklist: {
        type: [Schema.Types.ObjectId],
        default: []

    }
    
    

});

const User =  mongoose.model('User', userSchema);
exports.User = User;


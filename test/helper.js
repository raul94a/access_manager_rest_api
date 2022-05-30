const {User} = require('../models/User');
const jwt = require('jsonwebtoken');

async function retrieveUserData(phoneNumber) {
    const user = await User.findOne({ phoneNumber: phoneNumber }).select('-__v').catch(err => {
         //log
         console.log(err)
         throw err;
         // return res.status(500).json({ error: 'Something went wrong' })
         
     });
     //function to check if the connection device is still the same
     //we're not gonna do for now
     if (user) {
         //create jwt
         const token = jwt.sign(user.id.toString(),'secretkey');
         user['token'] = token;
        
         
         // return res.status(200).json(user);
         return user;
     }
 }

 exports.retrieveUser = retrieveUserData;
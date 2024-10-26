const jwt = require('jsonwebtoken');
const env = require('../config/env.json');
const User = require('../models/User').User;
const DeviceInfo = require('../models/DeviceInfo').DeviceInfo;
const { authLogger, message } = require('../utils/logger')

exports.signup = async (req, res, next) => {
    //receives a json with phoneNumber and uid
    //As User should be SAVED and Device into too in their corresponding
    //collections, maybe it should be a good idea to send a JSON with the following structure
    /** 
     *  {
     *      "user":{
     *          ...userData
     *      },
     *      "device":{
     *              ...device data
     *      }
     *  }
     * 
     * 
    */


    const body = req.body;
    // console.log(body);
    const { user: userData, device: deviceData } = body;
    const user = await registerUser(userData, res,req);
    const device = await registerDevice(deviceData, user._id, res,req);
    //añadir aqui jwt
    console.log(user, device);

    authLogger.info(message(req, 200, `${user['uid']} registered successfully`))
    return res.status(200).json(user);

}


exports.login = async (req, res, next) => {
    const body = req.body;
    const phoneNumber = body.phoneNumber;
    // console.log(body);
    await retrieveUserData(phoneNumber, res, req);
    //
}
/**
 * 
 * @param {Object} user 
 * @returns {User} 
 */




async function registerUser(userData, res,req) {
    console.log(userData)
    const { uid, phoneNumber } = userData;
    const findUser = await User.findOne({ phoneNumber: phoneNumber }).catch(err => {
        authLogger.error(message(req, 500, `${err}`))
        return res.status(500).json({ error: 'Something went wrong' })
    });
    if (findUser) {

        authLogger.warn(message(req, 409, `the user is already registered`))
        return res.status(409).json({ error: 'User is already registered' })

    }
    const user = new User({
        uid: uid,
        phoneNumber: phoneNumber
    });
    await user.save().catch(err => {
        authLogger.error(message(req, 500, `the user is already registered`, `Internal error: ${err}`)
        )
        return res.status(500).json({ error: 'Internal error' })
    });
    authLogger.info(message(req, 200, `User has been registered with success`))
    return user;
}

/**
 * 
 * @param {Object} device
 * @returns {DeviceInfo}
 */
async function registerDevice(deviceData, userId, res,req) {
    const device = new DeviceInfo({ ...deviceData, user: userId });
    // console.log(device);
    device.save().catch(err => {

        authLogger.error(message(req, 500, `Internal error: ${err}`))
        return res.status(500).json({ error: 'Something went wrong' })

    });
    authLogger.info(message(req, 200, `Device has been registered with success`))

    return device;
}
//with the phoneNumber we retrive the user information
async function retrieveUserData(phoneNumber, res, req) {
    const user = await User.findOne({ phoneNumber: phoneNumber }).select('-__v').catch(err => {
        //log


        authLogger.error(message(req, 500, `Internal error: ${err.toString()}`))
        return res.status(500).json({ error: 'Something went wrong' })
    });
    //function to check if the connection device is still the same
    //we're not gonna do for now
    if (user) {
        //create jwt
        const token = jwt.sign(user.id.toString(), env['jwt-secret']);
        console.log(token);
        user['token'] = token;

        authLogger.info(message(req, 200, `user ${user['uid']} has been retrieved successfully`))
        return res.status(200).json(user);
    }
    authLogger.error(message(req, 404, `user not found`))
    return res.status(404).json({ error: 'User not found' })
}
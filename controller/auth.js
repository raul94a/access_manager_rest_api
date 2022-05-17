const User = require('../models/User').User;
const DeviceInfo = require('../models/DeviceInfo').DeviceInfo;

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
    console.log(body);
    const { user: userData, device: deviceData } = body;
    const user = await registerUser(userData, res);
    const device = await registerDevice(deviceData, user._id, res);
    //añadir aqui jwt
    console.log(user, device);
    return res.status(200).json(user);

}


exports.login = async (req, res, next) => {
    const body = req.body;
    const phoneNumber = body.phoneNumber;
    console.log(body);
    await retrieveUserData(phoneNumber, res);
    //
}
/**
 * 
 * @param {Object} user 
 * @returns {User} 
 */




async function registerUser(userData, res) {
    console.log(userData)
    const { uid, phoneNumber } = userData;
    const findUser = await User.findOne({ phoneNumber: phoneNumber }).catch(err => {
        res.status(500).json({ error: 'Something went wrong' })
    });
    if (findUser) {
        res.status(409).json({ error: 'User is already registered' })

    }
    const user = new User({
        uid: uid,
        phoneNumber: phoneNumber
    });
    await user.save().catch(err => {
        return res.status(500).json({ error: 'Internal error' })
    });

    return user;
}

/**
 * 
 * @param {Object} device
 * @returns {DeviceInfo}
 */
async function registerDevice(deviceData, userId, res) {
    const device = new DeviceInfo({ ...deviceData, user: userId });
    // console.log(device);
    device.save().catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' })

    });

    return device;
}
//with the phoneNumber we retrive the user information
async function retrieveUserData(phoneNumber, res) {
    const user = await User.findOne({ phoneNumber: phoneNumber }).select('-__v').catch(err => {
        //log
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    });
    //function to check if the connection device is still the same
    //we're not gonna do for now
    if (user) {
        user
        return res.status(200).json(user);
    }
    return res.status(404).json({ error: 'User not found' })
}
const { AccessManagerDevice } = require('../models/AccessManagerDevice');
const { AccessManagerDeviceData } = require('../models/AccessManagerDeviceData');
const { User } = require('../models/User');
const path = require('path')
const qr = require('qrcode');

exports.registerADM = async (req, res, next) => {
    const body = req.body;
    const { registrationCode, user } = body;
    //search DEVICE
    const searchedDevice = await AccessManagerDevice.findOne({ registrationCode: registrationCode });
    if (!searchedDevice) {
        return res.status(404).json({ error: 'Device not found' })
    }
    if (searchedDevice['registered']) {
        return res.status(419).json({ error: 'Device is already registered' })
    }
    // if (searchedDevice['registrationCode'] !== registrationCode) {
    //     return res.status(419).json({ error: 'Could not register device' })
    // }
    searchedDevice.user = user;
    searchedDevice.registered = true;

    await searchedDevice.save().catch(err => {
        return res.status(500).json({ error: 'Something is wrong' })
    });
    //should generate some access Manager device default data
    const deviceData = await createDefaultDeviceData(searchedDevice._id, user);
    searchedDevice.config = deviceData;

    console.log(deviceData);
    return res.status(200).json({ device: searchedDevice, deviceData: deviceData })
}

//ONLY FOR TESTING ISSUES
exports.createADM = async (req, res, next) => {
    const body = req.body;
    const { registrationCode } = body;
    const accessManager = new AccessManagerDevice({ registrationCode: registrationCode });
    await accessManager.save();
    return res.status(200).json(accessManager);
}

exports.getUserContactListDevices = async (req, res, next) => {
    console.log('PETICIÓN A CONTACT LIST DEVICES')
    const body = req.body;
    const { contactsPhones, userId } = body;
    // console.log(contactsPhones)
    const users = await User.find({ 'phoneNumber': { $in: contactsPhones } });
    console.log('users: ', users)
    const devices = await getDevices(users, userId)

    // console.log(devices);
    return res.status(200).json(devices);

}
exports.getAccessManagerDeviceData = async (req, res, next) => {
    console.log('in ADM DATA')
    const param = req.params
    console.log(param)
    const { device } = param;
    console.log(device)
    const deviceData = await AccessManagerDeviceData.findOne({ device: device })
        .select('-admin -allowedUsers -__v')
        .catch(err =>
            res.status(500)
                .json({ error: 'Something went wrong!' }))
    // const qrcreate = qr.create('HOLA QUE TAL TIO');
    // console.log(__dirname)

    // const pa = path.join('..',__dirname, 'img')
    // await qr.toFile(`C:\\Users\\Raul9\\Desktop\\Desarrollo\\Proyectos\\TFC\\api\\img\\dslfjasf.png`, JSON.stringify(deviceData), {
    //     color: {
    //         dark: '#00F',  // Blue dots
    //         light: '#0000' // Transparent background
    //     }
    // });
    return res.status(200).json(deviceData);

}


async function getDevices(users, userId) {
    const devices = [];
    for (let user of users) {
        console.log(`user id: ${user._id.toString()}`)
        let deviceData = await AccessManagerDeviceData.findOne({ admin: user._id })
        let isUserAllowed = false;

        //BOOK ACCESS TYPE IS NOT CONTROLLED
        if (deviceData['accessType'] == 'REQUEST') {
            isUserAllowed = deviceData.allowedUsers.includes(userId) || false;

        }
        devices.push(deviceData['accessType'] == 'REQUEST'
            ? { user: user, deviceData: accessManagerDataToObject(deviceData), allowed: isUserAllowed }
            : { user: user, deviceData: accessManagerDataToObject(deviceData) }
        );
    }
    return devices;
}

function accessManagerDataToObject(data) {
    return {
        accessType: data['accessType'],
        active: data['active'],
        address: data['address'],
        device: data['device']


    };
}
/**
 * 
 * @param {Schema.Type.ObjectID} deviceId 
 * @returns {{}}
 */
async function createDefaultDeviceData(deviceId, userId) {
    const deviceData = new AccessManagerDeviceData({
        active: true,
        accessType: 'ALL',
        device: deviceId,
        admin: userId,
        address: 'C / Sevilla 14, Martos, Jaén'

    });
    //emitir en el canal del device!!! SOCKET NEEDED

    await deviceData.save();
    return deviceData;


}
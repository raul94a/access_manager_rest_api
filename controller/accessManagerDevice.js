const { userLogger, accessManagerLogger, message } = require('../utils/logger');

const { AccessManagerDevice } = require('../models/AccessManagerDevice');
const { AccessManagerDeviceData } = require('../models/AccessManagerDeviceData');
const { User } = require('../models/User');
const io = require('../socket');
const path = require('path')
const qr = require('qrcode');
const jwt = require('jsonwebtoken');

exports.registerADM = async (req, res, next) => {
    const body = req.body;
    const { registrationCode, user } = body;
    //search DEVICE
    const searchedDevice = await AccessManagerDevice.findOne({ registrationCode: registrationCode });
    if (!searchedDevice) {

        accessManagerLogger.error(message(req, 404, `Device has not been found`, 'Maybe registration code is not valid'))
        return res.status(404).json({ error: 'Device not found' })
    }
    if (searchedDevice['registered']) {
        accessManagerLogger.error(message(req, 419, `Device is already registered`))
        return res.status(419).json({ error: 'Device is already registered' })
    }
    // if (searchedDevice['registrationCode'] !== registrationCode) {
    //     return res.status(419).json({ error: 'Could not register device' })
    // }
    searchedDevice.user = user;
    searchedDevice.registered = true;

    await searchedDevice.save().catch(err => {
        accessManagerLogger.error(`Status code 500; Device could not be saved; likely database issue; ${err.toString()}`);
        return res.status(500).json({ error: 'Something is wrong' })
    });
    //should generate some access Manager device default data
    const deviceData = await createDefaultDeviceData(searchedDevice._id, user);
    searchedDevice.config = deviceData;

    // console.log(deviceData);
    accessManagerLogger.info(`Status code 200; Device ${searchedDevice._id.toString()} registered by user ${user}
     from ip ${req.ip} with registration code of ${registrationCode}`)
    return res.status(200).json({ device: searchedDevice, deviceData: deviceData })
}
exports.changeActiveDeviceStatus = async (req, res, next) => {
    const body = req.body;
    const { deviceId, active } = body;
    const searchedDevice = await AccessManagerDeviceData.findOneAndUpdate({ device: deviceId }, { active: active }, {
        new: true,
        upsert: false
    }).catch(err => {
        accessManagerLogger.error(message(req, 404, `Device has not been found`))
        return res.status(404).json({ error: 'Device could not be found' })
    })



    console.log('Successful');
    io.getIO()
        .emit(`accessRequest-${deviceId}`, { action: 'changeActiveStatus', active: active });
    return res.status(200).json({ success: `The device has been updated successfully. Now is in ${active ? 'enabled' : 'disabled'}` });
}
exports.changeDeviceAccessType = async (req, res, next) => {
    const body = req.body;
    const { deviceId, accessType } = body;
    const searchedDevice = await AccessManagerDeviceData.findOneAndUpdate({ device: deviceId }, { accessType: accessType }, {
        new: true,
        upsert: false
    }).catch(err => {
        accessManagerLogger.error(message(req, 404, `Device has not been found`))


        res.status(404).json({ error: 'Device could not be found' })
    })


    console.log('Successful accesstype update');
    return res.status(200).json({ success: `The device access type has been updated successfuly. Now is in ${accessType} mode.` })
}

exports.checkDeviceStatus = async (req, res, next) => {
    const params = req.params;
    const { deviceId } = params;
    const searchedDevice = await AccessManagerDeviceData.find({ device: deviceId });
    if (!searchedDevice) {

        accessManagerLogger.info(message(req, 404, `Device has not been found`))

        return res.status(404).json({ error: 'Device not found' })
    }
    const active = searchedDevice[0].active;
    console.log(searchedDevice, active)
        ; return res.status(200).json({ active: active });
}

exports.changeAllowedUserStatusInDevice = async (req, res, next) => {

    const body = req.body;
    const { deviceId, userId } = body;
    const searchedDeviceData = await AccessManagerDeviceData.findOne({ device: deviceId });
    if (!searchedDeviceData) return res.status(404).json({ error: 'Something has been bad' })
    let isIncluded = searchedDeviceData.allowedUsers.includes(userId);
    if (isIncluded) {
        let newAllowedList = searchedDeviceData.allowedUsers.filter(element => element != userId);
        searchedDeviceData.allowedUsers = newAllowedList;
    } else {
        searchedDeviceData.allowedUsers.push(userId);


    }
    console.log(searchedDeviceData);
    await searchedDeviceData.save().catch(err => {
        accessManagerLogger.info(message(req, 500, 'Device status could not be persisted into database'))


        return res.status(500).json({ error: 'Something\'s wrong!' })
    });

    return res.status(200).json({ message: `The user has been ${isIncluded ? 'deleted from list' : 'added to the list'}` })


}

// }
//ONLY FOR TESTING ISSUES
exports.createADM = async (req, res, next) => {

    const body = req.body;
    const { registrationCode } = body;
    const accessManager = new AccessManagerDevice({ registrationCode: registrationCode });
    await accessManager.save();
    return res.status(200).json(accessManager);
}


//amd from contacts list of auth user
exports.getUserContactListDevices = async (req, res, next) => {
    console.log('PETICIÓN A CONTACT LIST DEVICES')
    const body = req.body;
    const { contactsPhones, userId } = body;
    // console.log(contactsPhones)
    const users = await User.find({ 'phoneNumber': { $in: contactsPhones } }).select('-uid -__v');
    console.log('users: ', users)
    const devices = await getDevices(users, userId,req)

    // console.log(devices);
    return res.status(200).json(devices);

}
//amd of the auth user
exports.getUserDevices = async (req, res, next) => {
    console.log('enter in get user devices');
    const param = req.params;
    const { admin } = param;
    console.log(admin, admin.length);
    if (admin.toString().length != 24) {
        return res.status(403).json({ error: 'BAD REQUEST' });
    }
    const devices = await AccessManagerDeviceData.find({ admin: admin }).select('-__v -admin')
    console.log(devices);
    console.log(admin, devices)
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
        .catch(err => {

            accessManagerLogger.info(message(req, 500, 'Device status could not be persisted into database', 'also likely database issue')
            )

            return res.status(500)
                .json({ error: 'Something went wrong!' })
        })

    return res.status(200).json(deviceData);

}

exports.turnOffUserAccessManagers = async (req, res, next) => {
    const body = req.body;
    const { userId: admin } = body;

    const searchedUserAccessManagers = await AccessManagerDeviceData.find({ admin: admin });

    for (let userAccessManager of searchedUserAccessManagers) {
        userAccessManager['active'] = false;
        await userAccessManager.save();
    }
    const devicesNumber = searchedUserAccessManagers.length;
    return res.status(200).json({ message: `Your ${devicesNumber > 1 ? devicesNumber : ''} ${devicesNumber > 1 ? 'devices have' : 'device has'} been disabled!` })

}


async function getDevices(users, userId,req) {
    const devices = [];
    for (let user of users) {
        let blacklist = user['blacklist'] || [];
        let showAMDLocation = user['showAMDLocation'] || 'ALL';
        let pictureVisibleBy = user['pictureVisibleBy'] || 'ALL';
        console.log('===================')
        console.log(user);
        console.log('=================')
        if (!blacklist.includes(userId)) {
            let contacts = user['contacts'] || [];
            if (pictureVisibleBy === 'CONTACTS' && !contacts.includes(userId.toString())) {
                user['imageUrl'] = '';
            }
            let showLocation = true;
            if (showAMDLocation === 'CONTACTS' && !contacts.includes(userId.toString())) {
                showLocation = false;
            }
            if (showAMDLocation === 'NOBODY') {
                showLocation = false;
            }


            userLogger.info(message(req, 500, `${userId} is ${showLocation ? 'allowed' : 'not allowed'} to see the location of AMD belonging to ${user._id.toString()}`))
            console.log(`user id: ${user._id.toString()}`)
            let deviceData = await AccessManagerDeviceData.findOne({ admin: user._id })
            //contacts MUST be protected from access
            user['contacts'] = [];
            if (deviceData) {

                let isUserAllowed = false;

                //BOOK ACCESS TYPE IS NOT CONTROLLED
                if (deviceData['accessType'] == 'REQUEST') {
                    isUserAllowed = deviceData.allowedUsers.includes(userId) || false;

                }
                if (user._id.toString() !== userId) {

                    devices.push(deviceData['accessType'] == 'REQUEST'
                        ? { user: user, deviceData: accessManagerDataToObject(deviceData), allowed: isUserAllowed, showLocation: showLocation }
                        : { user: user, deviceData: accessManagerDataToObject(deviceData) }
                    );
                }
            }
            else {
                if (user._id.toString() !== userId) {

                    devices.push({ user: user, deviceData: {} })
                }
            }
        } else {
            console.log(`${userId} está en la blacklist de ${user._id}`)
        }
    }
    console.log(devices);
    return devices;
}

function accessManagerDataToObject(data) {
    return {
        accessType: data['accessType'],
        active: data['active'],
        address: data['address'],
        device: data['device'],
        lat: data['lat'],
        long: data['long']


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


const { AccessRequest } = require('../models/AccessRequest');
const { requestLogger, message } = require('../utils/logger');
const { AccessManagerDeviceData } = require('../models/AccessManagerDeviceData');
const env = require('../config/env.json');
const path = require('path')
const qr = require('qrcode');
const io = require('../socket');
const cryptr = require('cryptr');
const { json } = require('express');

exports.createAccessRequest = async (req, res, next) => {
    const body = req.body;
    const { user, device } = body;
    const date = new Date(Date.now());
   
    const data = { user: user, device: device, date: date };
    const accessRequest = new AccessRequest({ ...data });
    await accessRequest.save();
    console.log(`Request access`)
    requestLogger.info(message(req, 0, `accessRequestSaved`)
    )
    //generate qr
    const imageId = `${accessRequest._id}${accessRequest.user}.png`;
    const appDir = path.dirname(require.main.filename)
    const imagePath = path.join(appDir, 'public', 'img', imageId);
    const crypt = new cryptr(env['cryptr-secret']);
    const stringifyAccessRequest = JSON.stringify(accessRequest);
    const encryption = crypt.encrypt(stringifyAccessRequest);
    await qr.toFile(imagePath, encryption, {
        color: {
            dark: '#7009b0',  // Blue dots
            light: '#aff6fa' // Transparent background
        }
    });
    requestLogger.info(message(req, 200, `QR generated. It only can be used by ${user} into device ${device} with identifier ${accessRequest._id.toString()}`)
    )
    const imageURL = env['QR-path'] + imageId;
    //initialize socket!!!!!!!
    console.log(`Emitting in channel accessRequest-${device}`)
    io.getIO().emit(`accessRequest-${device}`, { action: 'readQR', callingUser: user, qrUrl: imageURL });
}

exports.checkAccessRequest = async (req, res, next) => {
    const body = req.body;
    const { postedUserId, accessRequest } = body;
    const decrypter = new cryptr(env['cryptr-secret']);
    const decypherAR = JSON.parse(decrypter.decrypt(accessRequest));
    const searchedAccessRequest = await AccessRequest.findOne({ _id: decypherAR._id });

    print(searchedAccessRequest);
    if (decypherAR.user !== postedUserId) {
        searchedAccessRequest.success = false;
        await searchedAccessRequest.save();


        requestLogger.warn(message(req, 401, `Not valid access request. The user ${postedUserId || 'UNKNOWN'}`))

        //socket
        print(`SOCKET CHANNEL: accessRequest-${searchedAccessRequest.device.toString()}`);
        io.getIO()
            .emit(`accessRequest-${searchedAccessRequest.device.toString()}`
                , { action: 'checkDispatched', callingUser: accessRequest.user, success: false });
        return res.status(401).json({ success: false });
    }

    searchedAccessRequest.success = true;
    await searchedAccessRequest.save();


    print(`SOCKET CHANNEL: accessRequest-${searchedAccessRequest.device.toString()}`);

    //socket
    io.getIO()
        .emit(`accessRequest-${searchedAccessRequest.device.toString()}`
            , { action: 'checkDispatched', callingUser: decypherAR.user, success: true });
    requestLogger.info(message(req, 200, `Successful access request with the identifier ${decypherAR._id}`))
    return res.status(200).json({ success: true });
}


exports.getGeneralAccessRequestStats = async (req, res, next) => {
    const params = req.params;
    //we need to know stats from an admin devices
    const { admin } = params;
    if (admin.length !== 24) {
        requestLogger.error(message(req, 400, 'Bad request', 'Admin string has a length different from 24'))
        return res.status(400).json({ error: 'Bad request' })
    }
    const searchedAccessManagers = await AccessManagerDeviceData.find({ admin: admin }).catch(err => {
        requestLogger.error(message(req, 500, 'Internal server error', 'Maybe database connection lost?'))
        return res.status(500).json({ error: 'Internal server error' })

    });
    const devices = [];
    searchedAccessManagers.forEach(accessManager => devices.push(accessManager.device));
    const searchedAccessRequest = await AccessRequest.find({ device: { $in: devices } }).catch(err => {
        requestLogger.error(message(req, 500, 'Internal server error', 'Maybe database connection lost?'))
        return res.status(500).json({ error: 'Internal server error' })

    });

    const total = searchedAccessRequest.length;
    const lastWeekDate = getLastWeeksDate();
    const lastWeekRequests = searchedAccessRequest.filter(accessRequest => lastWeekDate < accessRequest.date);
    requestLogger.info(message(req, 200, `Genral stats from ${admin} have been calculated successfully`));
    return res.status(200).json({
        totalRequests: total,
        lastWeekRequests: lastWeekRequests.length
    });


}





function getLastWeeksDate() {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
}




function print(term) {
    return console.log(term)
}
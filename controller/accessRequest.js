const { AccessRequest } = require('../models/AccessRequest');
const requestLogger = require('../utils/logger').requestLogger
const env = require('../config/env.json');
const path = require('path')
const qr = require('qrcode');
const io = require('../socket');

exports.createAccessRequest = async (req, res, next) => {
    const body = req.body;
    const { user, device } = body;
    const date = new Date(Date.now());
    const data = { user: user, device: device, date: date };
    const accessRequest = new AccessRequest({ ...data });
    await accessRequest.save();
    //generate qr
    const imageId = `${accessRequest._id}${accessRequest.user}.png`;
    const appDir = path.dirname(require.main.filename)
    const imagePath = path.join(appDir, 'public', 'img', imageId);
    console.log(imagePath);
    await qr.toFile(imagePath, JSON.stringify(accessRequest), {
        color: {
            dark: '#7009b0',  // Blue dots
            light: '#aff6fa' // Transparent background
        }
    });
    requestLogger.info(`QR generated. It only can be used by ${user} into device ${device} with identifier ${accessRequest._id.toString()}`)
    const imageURL = env['QR-path'] + imageId;
    //initialize socket!!!!!!!
    io.getIO().emit(`accessRequest-${device}`, { action: 'readQR', callingUser: user, qrUrl: imageURL });
}

exports.checkAccessRequest = async (req, res, next) => {
    const body = req.body;
    const { postedUserId, accessRequest } = body;
    console.log(accessRequest);
    const searchedAccessRequest = await AccessRequest.findOne({ _id: accessRequest._id });
    print(searchedAccessRequest);
    if (accessRequest.user !== postedUserId) {
        print('access request is not valid')
        searchedAccessRequest.success = false;
        await searchedAccessRequest.save();
        requestLogger.warn(`Not valid access request. The user ${postedUserId} 
                has made use of QR-Code that belongs to the user ${accessRequest.user.toString()} for the device ${device} 
                and the access request ${accessRequest._id.toString()}`)

        //socket
        print(`SOCKET CHANNEL: accessRequest-${searchedAccessRequest.device.toString()}`);
        io.getIO()
            .emit(`accessRequest-${searchedAccessRequest.device.toString()}`
                , { action: 'checkDispatched', callingUser: accessRequest.user, success: false });
        return res.status(401).json({ success: false });
    }
    print('access request is valid')
    searchedAccessRequest.success = true;
    await searchedAccessRequest.save();


    print(`SOCKET CHANNEL: accessRequest-${searchedAccessRequest.device.toString()}`);

    //socket
    io.getIO()
        .emit(`accessRequest-${searchedAccessRequest.device.toString()}`
            , { action: 'checkDispatched', callingUser: accessRequest.user, success: true });
    requestLogger.info(`Status code 200; Successful access request with the identifier ${accessRequest._id.toString()}`)
    return res.status(200).json({ success: true });







}


function print(term) {
    return console.log(term)
}
const { AccessRequest } = require('../models/AccessRequest');
const { requestLogger, message } = require('../utils/logger');
const env = require('../config/env.json');
const path = require('path')
const qr = require('qrcode');
const io = require('../socket');
const cryptr = require('cryptr');

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
    io.getIO().emit(`accessRequest-${device}`, { action: 'readQR', callingUser: user, qrUrl: imageURL });
}

exports.checkAccessRequest = async (req, res, next) => {
    const body = req.body;
    const { postedUserId, accessRequest } = body;
    console.log(accessRequest);
    const decrypter = new cryptr(env['cryptr-secret']);
    const decypherAR = JSON.parse(decrypter.decrypt(accessRequest));
    console.table(decypherAR)
    console.log('POSTED USER ID:', postedUserId)
    const searchedAccessRequest = await AccessRequest.findOne({ _id: decypherAR._id });

    print(searchedAccessRequest);
    if (decypherAR.user !== postedUserId) {
        print('access request is not valid')
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
    print('access request is valid')
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


function print(term) {
    return console.log(term)
}
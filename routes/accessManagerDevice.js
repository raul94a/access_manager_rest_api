const router = require('express').Router();
const { verifyToken } = require('../middleware/verify-token');

const accessManagerDeviceController = require('../controller/accessManagerDevice');


router.get('/adm/data/:device',  accessManagerDeviceController.getAccessManagerDeviceData);
router.get('/adm/user/:admin', verifyToken, accessManagerDeviceController.getUserDevices);
router.get('/adm/status/device/:deviceId', verifyToken, accessManagerDeviceController.checkDeviceStatus)
router.put('/adm/register', verifyToken, accessManagerDeviceController.registerADM);
router.put('/adm/device/change-active-status', verifyToken, accessManagerDeviceController.changeActiveDeviceStatus);
router.put('/adm/device/change-access-type', verifyToken, accessManagerDeviceController.changeDeviceAccessType);
router.put('/adm/device/changeUserAllowedStatus', verifyToken, accessManagerDeviceController.changeAllowedUserStatusInDevice);
router.put('/adm/user/turnoff', verifyToken, accessManagerDeviceController.turnOffUserAccessManagers);
router.post('/adm/create', verifyToken, accessManagerDeviceController.createADM);
router.post('/adm/contactdevices', verifyToken, accessManagerDeviceController.getUserContactListDevices);



exports.accessManagerDeviceRoutes = router;
const router = require('express').Router();


const accessManagerDeviceController = require('../controller/accessManagerDevice');


router.get('/adm/data/:device',accessManagerDeviceController.getAccessManagerDeviceData);
router.get('/adm/user/:admin', accessManagerDeviceController.getUserDevices);
router.get('/adm/status/device/:deviceId',accessManagerDeviceController.checkDeviceStatus)
router.put('/adm/register',accessManagerDeviceController.registerADM);
router.put('/adm/device/change-active-status', accessManagerDeviceController.changeActiveDeviceStatus);
router.put('/adm/device/change-access-type', accessManagerDeviceController.changeDeviceAccessType);
router.put('/adm/device/changeUserAllowedStatus',accessManagerDeviceController.changeAllowedUserStatusInDevice);
router.put('/adm/user/turnoff', accessManagerDeviceController.turnOffUserAccessManagers);
router.post('/adm/create', accessManagerDeviceController.createADM);

router.post('/adm/contactdevices', accessManagerDeviceController.getUserContactListDevices);



exports.accessManagerDeviceRoutes = router;
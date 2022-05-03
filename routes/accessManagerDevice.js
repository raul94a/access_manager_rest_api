const router = require('express').Router();


const accessManagerDeviceController = require('../controller/accessManagerDevice');


router.put('/adm/register',accessManagerDeviceController.registerADM);
router.post('/adm/create', accessManagerDeviceController.createADM);
router.post('/adm/contactdevices', accessManagerDeviceController.getUserContactListDevices);



exports.accessManagerDeviceRoutes = router;
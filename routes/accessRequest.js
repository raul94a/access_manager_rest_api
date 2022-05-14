const router = require('express').Router();
const accessRequestController = require('../controller/accessRequest');

router.post('/access-request',accessRequestController.createAccessRequest);
router.post('/check-access-request', accessRequestController.checkAccessRequest);



exports.router = router;
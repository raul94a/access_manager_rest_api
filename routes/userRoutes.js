const router = require('express').Router();




const userController = require('../controller/userController');
router.put('/user/profile/update', userController.updateProfileData);
router.put('/user/profile/update/picture', userController.updateProfilePicture);
exports.router = router;

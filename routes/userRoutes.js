const router = require('express').Router();
const {uploadImage} = require('../middleware/upload-image');
const { verifyToken } = require('../middleware/verify-token');




const userController = require('../controller/userController');
router.put('/user/profile/update', verifyToken, userController.updateProfileData);
router.put('/user/profile/update/picture', verifyToken, uploadImage, userController.updateProfilePicture);
router.put('/user/contacts/update', verifyToken, userController.updateContactsList);
router.put('/user/privacy/blacklist', verifyToken, userController.toggleUserFromBlacklist);
router.put('/user/privacy/picture', verifyToken, userController.changePictureVisibilityStatus);
router.put('/user/privacy/location', verifyToken, userController.changeShowAMDLocationStatus);

exports.router = router;

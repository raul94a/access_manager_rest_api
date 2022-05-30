const router = require('express').Router();
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       
        cb(null, 'storage/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname)
    }
})

const uploadMiddleware =  multer({ storage: storage }).single('imageUrl')



const userController = require('../controller/userController');
router.put('/user/profile/update', userController.updateProfileData);
router.put('/user/profile/update/picture', uploadMiddleware, userController.updateProfilePicture);
router.put('/user/contacts/update', userController.updateContactsList);
router.put('/user/privacy/blacklist', userController.toggleUserFromBlacklist);
router.put('/user/privacy/picture',userController.changePictureVisibilityStatus);
router.put('/user/privacy/location',userController.changeShowAMDLocationStatus);

exports.router = router;

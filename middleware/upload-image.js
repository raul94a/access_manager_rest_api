const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, 'storage/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname)
    }
})

const uploadMiddleware = multer({ storage: storage }).single('imageUrl')
exports.uploadImage = uploadMiddleware;

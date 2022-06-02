const multer = require('multer')
const {serverLogger, message} = require('../utils/logger');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        serverLogger.info(message(req, 888,'Destination function'))
        cb(null, 'storage')
    },
    filename: function (req, file, cb) {
        serverLogger.info(message(req, 888,'FILENAME FUNCTION'))

        cb(null, Date.now().toString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    //CUIDADO CON EL FILE MIMETYPE 
    //HAY QUE DECLARAR EN ELC LIENTE EL TIPO DE ARCHVO!
    console.log(file.mimetype)
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
    } else {
        console.log('FILTERED OUT')
        cb(null, false);
    }
};

const uploadMiddleware = multer({ storage: storage }).single('imageUrl')
exports.uploadImage = uploadMiddleware;

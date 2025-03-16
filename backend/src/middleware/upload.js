const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// Create uploads directory if it doesn't exist
const uploadsDirCars = path.join(__dirname, '../../uploads/cars');
const uploadsDirOffers = path.join(__dirname, '../../uploads/offers');
const uploadsDirNews = path.join(__dirname, '../../uploads/news');

if (!fs.existsSync(uploadsDirCars)) {
    fs.mkdirSync(uploadsDirCars, { recursive: true });
}
if (!fs.existsSync(uploadsDirOffers)) {
    fs.mkdirSync(uploadsDirOffers, { recursive: true });
}
if (!fs.existsSync(uploadsDirNews)) {
    fs.mkdirSync(uploadsDirNews, { recursive: true });
}

// Set storage engine
const storageCar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDirCars);
    },
    filename: function (req, file, cb) {
        // Rename file to avoid collisions
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const storageOffer = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDirOffers);
    },
    filename: function (req, file, cb) {
        // Rename file to avoid collisions
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const storageNews = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDirNews);
    },
    filename: function (req, file, cb) {
        // Rename file to avoid collisions
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Check file type
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|webp/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new ErrorResponse(messages.imageOnly, 400));
    }
};

// Initialize upload
exports. uploadCar = multer({
    storage: storageCar,
    limits: { fileSize: process.env.MAX_FILE_SIZE || 5000000 }, // Default to 5MB
    fileFilter: fileFilter,
});
exports. uploadOffer = multer({
    storage: storageOffer,
    limits: { fileSize: process.env.MAX_FILE_SIZE || 5000000 }, // Default to 5MB
    fileFilter: fileFilter,
});
exports. uploadNews = multer({
    storage: storageNews,
    limits: { fileSize: process.env.MAX_FILE_SIZE || 5000000 }, // Default to 5MB
    fileFilter: fileFilter,
});

// module.exports = upload;

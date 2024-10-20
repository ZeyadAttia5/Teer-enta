const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Util/Cloudinary'); // Ensure this path is correct

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Teer-Enta assets', // Cloudinary folder name
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    },
});

// Create the Multer upload instance
const upload = multer({ storage: storage });

// Export the upload instance
module.exports = upload;

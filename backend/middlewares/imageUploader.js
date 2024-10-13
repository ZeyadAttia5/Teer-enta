const upload = require('./mutler'); // Adjust the path as needed
const router = require('express').Router();

// Middleware function to upload a single file and attach the URL to req

// in the form data, the file key for the file should be named for example 'image'
//then the cloudinary will update the req.fileUrl with the url of the uploaded file
//then you can use the req.fileUrl to save the url in the database

const uploadSingleFile = (fieldName) => (req, res, next) => {
    if (!fieldName){
        return res.status(400).json({ message: 'Field name is required' });
    }
    const uploader = upload.single(fieldName); // Field name for the file upload

    uploader(req, res, (err) => {
        if (err) {
            // Handle any errors that occur during the upload
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }
        // If file is uploaded, append the file URL to req
        if (req.file) {
            req.fileUrl = req.file.path; // Cloudinary returns the file path as the URL
            console.log(req.fileUrl);
        }
        next(); // Proceed to the next middleware or route handler
    });
};



module.exports = uploadSingleFile;

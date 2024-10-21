const upload = require('./mutler'); // Adjust the path as needed
const router = require('express').Router();

// Middleware function to upload a single file and attach the URL to req

// in the form data, the file key for the file should be named for example 'image'
//then the cloudinary will update the req.fileUrl with the url of the uploaded file
//then you can use the req.fileUrl to save the url in the database

const uploadSingleFile = (fieldName, req, res) => {
    return new Promise((resolve, reject) => {
        if (!fieldName) {
            return reject({ status: 400, message: 'Field name is required' });
        }

        const uploader = upload.single(fieldName);

        uploader(req, res, (err) => {
            if (err) {
                // Reject the promise if an error occurs during file upload
                return reject({ status: 500, message: 'File upload failed', error: err.message });
            }

            if (req.file) {
                // Resolve the promise with the file path if successful
                resolve(req.file.path);
            } else {
                // Reject if no file is found in the request
                reject({ status: 400, message: 'No file found' });
            }
        });
    });
};



module.exports = uploadSingleFile;

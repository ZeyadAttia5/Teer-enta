const { uploadSingleFile , uploadMultipleFiles } = require('../middlewares/imageUploader');

exports.uploadFile=async (req, res, next)=> {
    try {
        const imageUrl = await uploadSingleFile('file', req, res);
        return res.status(200).json({ imageUrl });
    } catch (error) {
        return res.status(error.status).json({ message: error.message });
    }
}

exports.uploadFiles = async (req, res, next) => {
    try {
        const imageUrls = await uploadMultipleFiles('files', req, res);
        return res.status(200).json({ imageUrls });
    } catch (error) {
        return res.status(error.status).json({ message: error.message });
    }
}
import React, { useState, useRef } from 'react';
import { Check, X, Upload, Loader } from 'lucide-react';
import { uploadImage } from '../../api/image.ts';

const ImageUploader = ({ onImagePathChange }) => {
    const [uploadStatus, setUploadStatus] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleImageSelect = async (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        setErrorMessage('');
        setUploadStatus(null);

        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            setUploadStatus('error');
            return;
        }

        if (file.size > maxSize) {
            setErrorMessage('Image size should be less than 5MB');
            setUploadStatus('error');
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));
        await handleUpload(file);
    };

    const handleFileSelect = (event) => {
        handleImageSelect(event.target.files[0]);
    };

    const handleUpload = async (file) => {
        setIsUploading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadImage(formData);
            setUploadStatus('success');
            onImagePathChange(response.data.imageUrl);
        } catch (error) {
            setUploadStatus('error');
            setErrorMessage(error.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setUploadStatus(null);
        setPreviewUrl(null);
        setErrorMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="relative mb-4">
                {/* Preview Image or Upload Area */}
                {previewUrl ? (
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 relative">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                        {/* Reset Button */}
                        <button
                            onClick={handleReset}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-white border border-gray-300 rounded-full p-1"
                        >
                            <X size={16}/>
                        </button>
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="text-gray-400" size={32}/>
                        <p className="text-sm text-gray-700 mt-2">
                            Click to browse and upload an image
                        </p>
                        <p className="text-xs text-gray-500">JPEG, PNG, GIF, WebP (max 5MB)</p>
                    </div>
                )}
                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{display: 'none'}}
                />
            </div>
            <div className="mt-4">
                {isUploading && (
                    <div className="flex items-center text-blue-600">
                        <Loader size={20} className="animate-spin"/>
                        <span className="ml-2 text-sm font-medium">Uploading...</span>
                    </div>
                )}
                {uploadStatus === 'success' && (
                    <div className="flex items-center text-green-600">
                        <Check size={20}/>
                        <span className="ml-2 text-sm font-medium">Upload successful!</span>
                    </div>
                )}
                {uploadStatus === 'error' && (
                    <div className="flex items-center text-red-600">
                        <X size={20}/>
                        <span className="ml-2 text-sm font-medium">{errorMessage}</span>
                    </div>
                )}
            </div>
        </div>
    )
        ;
};

export default ImageUploader;

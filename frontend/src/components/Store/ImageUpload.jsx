import React, { useState } from "react";
import { uploadFile } from "../../api/account.ts"; 

const ImageUpload = ({ setImageUrl }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setUploading(true);
      try {
        const response = await uploadFile(selectedFile); // Upload to get the image URL
        setImageUrl(response.data.imageUrl); // Pass URL to parent component
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="grid w-full max-w-xs items-center gap-1.5">
      <input
        id="picture"
        type="file"
        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
        onChange={handleFileChange}
      />
      {uploading && <p>Uploading...</p>}
      {file && !uploading && <p>File selected: {file.name}</p>}
    </div>
  );
};

export default ImageUpload;

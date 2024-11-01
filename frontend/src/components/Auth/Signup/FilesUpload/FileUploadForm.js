import React, { useState, useCallback } from "react";

const FileUploadForm = ({setCertificates}) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setCertificates((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div
      className="flex flex-col items-center w-full max-w-md mx-auto mt-8"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label htmlFor="file" className="cursor-pointer">
        <div className="border-2 border-dashed border-gray-400 p-4 text-center rounded-lg hover:border-gray-600 transition">
          <svg viewBox="0 0 640 512" className="w-12 h-12 mx-auto">
            <path
              d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
              fill="currentColor"
            ></path>
          </svg>
          <p className="text-gray-700">Drag and Drop</p>
          <p className="text-gray-500">or</p>
          <span className="text-blue-500 underline">Browse files</span>
        </div>
        <input
          id="file"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </label>

      <div className="mt-4 w-full">
        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow"
              >
                <span className="text-gray-800">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileUploadForm;

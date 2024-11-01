import React, { useState } from "react";

const IDUpload = ({ setID }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log("file is"+event.target.files[0]);
    setID(event.target.files[0]);
  };

  return (
    /* From Uiverse.io by Yaya12085 */
    <div class="grid w-full max-w-xs items-center gap-1.5">
      {/* <label class="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        ID
      </label> */}
      <input
        id="picture"
        type="file"
        class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default IDUpload;

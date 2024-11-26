import React from "react";

const SearchHome = () => {
  return (
    <div className="flex items-center p-4 mx-auto rounded">
      <input
        type="text"
        placeholder="Search for activities, attractions, and more..."
        className="flex-1 px-4 py-2 border rounded-l focus:outline-none"
      />
      <button className="px-4 py-2 text-white bg-blue-600 rounded-r hover:bg-blue-700">
        Search
      </button>
    </div>
  );
};

export default SearchHome;

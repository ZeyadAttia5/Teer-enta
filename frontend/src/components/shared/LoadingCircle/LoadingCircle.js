import React from "react";

const LoadingCircle = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-32 h-32 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );
  };


export default LoadingCircle;
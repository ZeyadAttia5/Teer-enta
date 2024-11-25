import React from 'react'

const BackButton = () => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 text-lg text-white bg-first rounded-md shadow-md hover:bg-second hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-customGreen/50"
      onClick={() => window.history.back()}
    >
      <span className="text-2xl">←</span> Go Back
    </button>

  )
}

export default BackButton
import React from 'react'

const BackButton = () => {
  return (
    <button
      className="flex items-center ring-0 gap-2 px-4 py-2 text-lg text-black rounded-md transition-all duration-300 focus:outline-none"
      onClick={() => window.history.back()}
    >
      <span className="text-2xl">←</span> 

    </button>

  )
}

export default BackButton
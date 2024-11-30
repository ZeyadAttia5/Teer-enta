import React from 'react'

const BackButton = () => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 text-lg text-black rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-customGreen/50"
      onClick={() => window.history.back()}
    >
      <span className='hover:underline'><span className="text-2xl">←</span> Go Back</span>
    </button>

  )
}

export default BackButton
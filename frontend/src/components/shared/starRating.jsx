import React from 'react';

const StarRating = ({ rating }) => {
  const totalStars = 5; // Total number of stars
  const filledStars = Math.round(rating); // Round the rating to the nearest whole number

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${index < filledStars ? 'text-yellow-400' : 'text-fourth'}`} // Change color based on filled
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.223-6.001 5.824 1.419 8.287L12 18.897l-7.418 3.896 1.419-8.287-6.001-5.824 8.332-1.223z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;

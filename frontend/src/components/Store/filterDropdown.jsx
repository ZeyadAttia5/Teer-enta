import React, { useState } from 'react';

const FilterDropdown = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  const handleApply = () => {
    onFilterChange({ minPrice, maxPrice });
    setIsOpen(false); // Close the dropdown after applying the filter
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)} // Show dropdown on hover
      onMouseLeave={() => setIsOpen(false)} // Hide dropdown when not hovering
    >
      <button className="bg-customGreen text-white py-2 px-4 rounded-md focus:outline-none">
        Filter by Price ⌄
      </button>
      {isOpen && ( // Render dropdown content conditionally based on isOpen state
        <div className="absolute bg-white shadow-md rounded-lg p-5 min-w-[200px] z-10">
          <div className="flex flex-col gap-3 mb-3">
            <label className="flex justify-between items-center">
              Min Price:
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-16 p-1 border border-customGreen rounded focus:outline-none"
              />
            </label>
            <label className="flex justify-between items-center">
              Max Price:
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-16 p-1 border border-customGreen rounded focus:outline-none"
              />
            </label>
          </div>
          <button
            className="bg-customGreen text-white border-none rounded-md py-1 px-3 cursor-pointer transition-colors duration-300 hover:bg-darkerGreen"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;

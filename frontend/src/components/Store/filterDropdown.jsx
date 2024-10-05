import React, { useState, useEffect } from 'react';

const FilterDropdown = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [sortBy, setSortBy] = useState(filters.sortBy); // Default comes from filters prop
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSortBy(filters.sortBy); // Ensure the sortBy is synced with filters on mount/update
  }, [filters]);

  const handleApply = () => {
    onFilterChange({ minPrice, maxPrice, sortBy }); // Pass the updated filters to the parent
    setIsOpen(false);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value); // Update sorting selection
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="bg-customGreen text-white py-2 px-4 rounded-md focus:outline-none">
        Filter & Sort ⌄
      </button>
      {isOpen && (
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
          
          {/* Sorting Section */}
          <div className="flex flex-col gap-3 mb-3">
            <label>
              <input
                type="radio"
                value="rating"
                checked={sortBy === 'rating'}
                onChange={handleSortChange}
              />
              Sort by Ratings
            </label>
            <label>
              <input
                type="radio"
                value="price"
                checked={sortBy === 'price'}
                onChange={handleSortChange}
              />
              Sort by Price
            </label>
            <label>
              <input
                type="radio"
                value="name"
                checked={sortBy === 'name'}
                onChange={handleSortChange}
              />
              Sort Alphabetically
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

import React, { useState, useEffect } from 'react';

const FilterDropdown = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'desc');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSortBy(filters.sortBy);
    setSortOrder(filters.sortOrder || 'desc');
  }, [filters]);

  const handleApply = () => {
    onFilterChange({ minPrice, maxPrice, sortBy, sortOrder });
    setIsOpen(false);
  };

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    setSortBy(selectedValue);

    // Automatically set sortOrder based on selectedValue
    if (selectedValue === 'rating') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle order for ratings
    } else if (selectedValue === 'price') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle order for price
    }
  };

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
      <div
          className="relative inline-block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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

              <div className="flex flex-col gap-3 mb-3">
                <span>Sort by:</span>
                <label className="cursor-pointer">
                  <input
                      type="radio"
                      value="rating"
                      checked={sortBy === 'rating' && sortOrder === 'desc'}
                      onChange={handleSortChange}
                  />
                  Ratings: High to Low
                </label>
                <label className="cursor-pointer">
                  <input
                      type="radio"
                      value="rating"
                      checked={sortBy === 'rating' && sortOrder === 'asc'}
                      onChange={handleSortChange}
                  />
                  Rating: Low to High
                </label>
                <label className="cursor-pointer">
                  <input
                      type="radio"
                      value="price"
                      checked={sortBy === 'price' && sortOrder === 'desc'}
                      onChange={handleSortChange}
                  />
                  Price: High to Low
                </label>
                <label className="cursor-pointer">
                  <input
                      type="radio"
                      value="price"
                      checked={sortBy === 'price' && sortOrder === 'asc'}
                      onChange={handleSortChange}
                  />
                  Price: Low to High
                </label>
                <label className="cursor-pointer">
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

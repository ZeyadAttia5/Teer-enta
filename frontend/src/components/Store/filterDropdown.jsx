import React, { useState, useEffect } from "react";

const FilterDropdown = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || "desc");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSortBy(filters.sortBy);
    setSortOrder(filters.sortOrder || "desc");
  }, [filters]);

  const handleApply = () => {
    onFilterChange({ minPrice, maxPrice, sortBy, sortOrder });
    setIsOpen(false);
  };

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    setSortBy(selectedValue);

    // Automatically set sortOrder based on selectedValue
    if (selectedValue === "rating") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle order for ratings
    } else if (selectedValue === "price") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle order for price
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
      <button className="bg-white flex gap-2 text-first py-1 px-2 rounded-md focus:outline-none">
        <span className="mt-0.5">Filter & Sort</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
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
                className="w-16 p-1 border border-[#58A399] rounded focus:outline-none"
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
                checked={sortBy === "rating" && sortOrder === "desc"}
                onChange={handleSortChange}
              />
              Ratings: High to Low
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                value="rating"
                checked={sortBy === "rating" && sortOrder === "asc"}
                onChange={handleSortChange}
              />
              Rating: Low to High
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                value="price"
                checked={sortBy === "price" && sortOrder === "desc"}
                onChange={handleSortChange}
              />
              Price: High to Low
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                value="price"
                checked={sortBy === "price" && sortOrder === "asc"}
                onChange={handleSortChange}
              />
              Price: Low to High
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                value="name"
                checked={sortBy === "name"}
                onChange={handleSortChange}
              />
              Sort Alphabetically
            </label>
          </div>

          <button
            className="bg-[#58A399] text-white border-none rounded-md py-1 px-3 cursor-pointer transition-colors duration-300 hover:bg-darkerGreen"
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

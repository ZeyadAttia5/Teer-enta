import React, { useState } from 'react';
import './filterDropdown.css';

const FilterDropdown = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

  const handleApply = () => {
    onFilterChange({ minPrice, maxPrice });
  };

  return (
    <div className="filter-dropdown">
      <button className="dropdown-button">Filter by Price ⌄</button>
      <div className="dropdown-content">
        <div className="price-filter">
          <label>
            Min Price:
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>
        </div>
        <button className="apply-button" onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default FilterDropdown;

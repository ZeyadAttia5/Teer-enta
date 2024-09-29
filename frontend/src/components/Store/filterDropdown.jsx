import React, { useState } from 'react';
import './filterDropdown.css'; // Custom styles for the dropdown

const FilterDropdown = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    magnets: false,
    tableware: false,
    trinkets: false,
    museums: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleApply = () => {
    onFilterChange(selectedFilters);
  };

  return (
    <div className="filter-dropdown">
      <button className="dropdown-button">Choose Category ⌄</button>
      <div className="dropdown-content">
        <label>
          <input
            type="checkbox"
            name="magnets"
            checked={selectedFilters.hotels}
            onChange={handleCheckboxChange}
          />
          Magnets
        </label>
        <label>
          <input
            type="checkbox"
            name="tableware"
            checked={selectedFilters.restaurants}
            onChange={handleCheckboxChange}
          />
          Tableware
        </label>
        <label>
          <input
            type="checkbox"
            name="trinkets"
            checked={selectedFilters.landmarks}
            onChange={handleCheckboxChange}
          />
          Trinkets
        </label>
        <label>
          <input
            type="checkbox"
            name="museums"
            checked={selectedFilters.museums}
            onChange={handleCheckboxChange}
          />
          Museums
        </label>
        <button className="apply-button" onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default FilterDropdown;

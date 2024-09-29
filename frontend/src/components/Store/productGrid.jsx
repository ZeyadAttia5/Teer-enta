import React, { useState } from 'react';
import './productGrid.css';
import FilterDropdown from './filterDropdown'; // Import the filter dropdown
import image1 from './sampleImages/pic1.jpg';
import image2 from './sampleImages/pic2.jpg';
import image3 from './sampleImages/pic3.jpg';
import image4 from './sampleImages/pic4.jpg';

const ProductGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const products = [
    { id: 1, name: 'Hagia Sophia Magnet', image: image1, category: 'magnets' },
    { id: 2, name: 'Decorated Plate', image: image2, category: 'tableware' },
    { id: 3, name: 'Magnets', image: image3, category: 'magnets' },
    { id: 4, name: 'Amulet', image: image4, category: 'trinkets' },
    // Add more products as needed
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = Object.keys(filters).some((key) => filters[key] && product.category === key);
    return matchesSearch && (matchesFilter || !Object.values(filters).some(Boolean));
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      {/* Container to align search bar and filter dropdown */}
      <div className="search-filter-container">
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Dropdown */}
        <FilterDropdown onFilterChange={handleFilterChange} />
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <button className="product-button">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

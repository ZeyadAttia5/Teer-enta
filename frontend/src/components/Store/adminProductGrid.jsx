// AdminProductGrid.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './productGrid.css'; // Reuse existing styles
import image1 from './sampleImages/pic1.jpg';
import image2 from './sampleImages/pic2.jpg';
import image3 from './sampleImages/pic3.jpg';
import image4 from './sampleImages/pic4.jpg';

const AdminProductGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
  });

  const products = [
    { id: 1, name: 'Hagia Sophia Magnet', image: image1, category: 'magnets', price: 100, description: 'A beautiful magnet of Hagia Sophia.', seller: 'Turkish Souvenirs', ratings: 4.5, reviews: ['Great quality!', 'Perfect souvenir!'] },
    { id: 2, name: 'Decorated Plate', image: image2, category: 'tableware', price: 30, description: 'A hand-painted decorative plate.', seller: 'Crafts Shop', ratings: 4.0, reviews: ['Lovely craftsmanship!', 'Good price.'] },
    { id: 3, name: 'Magnets', image: image3, category: 'magnets', price: 40, description: 'Set of fridge magnets.', seller: 'Local Artisans', ratings: 4.7, reviews: ['So cute!', 'Nice addition to my collection.'] },
    { id: 4, name: 'Amulet', image: image4, category: 'trinkets', price: 50, description: 'An authentic Turkish amulet.', seller: 'Turkish Souvenirs', ratings: 4.3, reviews: ['Love the design.', 'Beautiful colors.'] },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    return matchesSearch && matchesPrice;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {/* Optionally include your FilterDropdown here */}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <Link to={`/admin/edit-product/${product.id}`}>
              <button className="product-button">Edit Product</button>
            </Link>
            <Link to={`/product/${product.id}`}>
              <button className="product-button">View Details</button>
            </Link>
          </div>
        ))}
      </div>

      {/* Add New Product Button */}
      <Link to="/product/form">
        <button className="add-product-button">Add New Product</button>
      </Link>
    </div>
  );
};

export default AdminProductGrid;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilterDropdown from './filterDropdown'; // Reusing FilterDropdown
import StarRating from './starRating'; // Importing StarRating component
import { Input, Row, Col } from 'antd';
import { FaEdit } from 'react-icons/fa'; // Importing edit icon from react-icons

const AdminProductGrid = () => {
  const backURL = process.env.REACT_APP_BACKEND_URL; // Ensure consistent API URL

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000, // Adjust price range for filtering
    sortBy: 'rating', // Default sorting by rating
  });
  const [products, setProducts] = useState([]); // State for fetched products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backURL}/product/`); // Replace with your API endpoint
        setProducts(response.data);
      } catch (err) {
        setError(err.message); // Updated to show error message
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backURL]);

  // Helper function to calculate average rating
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
  };

  // Handle loading state
  if (loading) {
    return <div className="text-center mt-24">Loading products...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-24">Error: {error}</div>;
  }

  // Filter products based on search term and price range
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    return matchesSearch && matchesPrice;
  });

  // Sorting the filtered products
  filteredProducts = filteredProducts.sort((a, b) => {
    if (filters.sortBy === 'rating') {
      const avgRatingA = calculateAverageRating(a.ratings);
      const avgRatingB = calculateAverageRating(b.ratings);
      return avgRatingB - avgRatingA; // Sort by average rating (highest to lowest)
    } else if (filters.sortBy === 'price') {
      return b.price - a.price; // Sort by price (highest to lowest)
    } else if (filters.sortBy === 'name') {
      return a.name.localeCompare(b.name); // Sort alphabetically by name
    }
    return 0;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Update filters state
  };

  return (
    <div className="container mx-auto p-5 relative">
      {/* Search and Filter Container */}
      <div className="flex justify-start items-center gap-4 mt-24 mb-5">
        <Input
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 border-customGreen rounded-full border-2 focus:border-customGreen transition-colors duration-300" // Increased border thickness
        />
        <FilterDropdown filters={filters} onFilterChange={handleFilterChange} /> {/* Reusing FilterDropdown */}
      </div>

      {/* Product Grid */}
      <Row gutter={[16, 16]} className="mt-5">
        {filteredProducts.map((product) => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
            <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out m-4">
              <img
                className="w-full h-48 object-cover"
                src={product.image || 'defaultImageUrl.jpg'} // Use a default image if product.image is not available
                alt={product.name}
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-bold text-2xl mb-2 text-gray-800">{product.name}</h3>
                <StarRating rating={calculateAverageRating(product.ratings)} /> {/* Display StarRating */}
                <p className="font-semibold text-customGreen">${product.price.toFixed(2)}</p>
                <div className="h-16 overflow-hidden"> {/* Fixed height for consistent box size */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {product.description && product.description.length > 100
                      ? `${product.description.slice(0, 100)}...`
                      : product.description || 'No description available.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/edit-product/${product._id}`} className="flex-1">
                    <button className="bg-customGreen text-white w-full py-2 transition-colors duration-300 hover:bg-darkerGreen rounded-none flex items-center justify-center">
                      <FaEdit className="mr-2" /> {/* Edit Icon */}
                      Edit Product
                    </button>
                  </Link>
                  <Link to={`/product/${product._id}`} className="flex-1">
                    <button className="bg-customGreen text-white w-full py-2 transition-colors duration-300 hover:bg-darkerGreen rounded-none">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Add New Product Button */}
      <Link to="/product/form" className="absolute bottom-5 right-5">
        <button className="bg-customGreen text-white px-4 py-1 transition-colors duration-300 hover:bg-darkerGreen rounded-lg">
          Add New Product
        </button>
      </Link>
    </div>
  );
};

export default AdminProductGrid;

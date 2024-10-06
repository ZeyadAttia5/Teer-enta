import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilterDropdown from './filterDropdown';
import StarRating from './starRating'; // Import the StarRating component
import { Input, Row, Col, Button } from 'antd';

const ProductGrid = () => {
  const backURL = process.env.REACT_APP_BACKEND_URL;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: Number.MAX_SAFE_INTEGER,
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <div className="container mx-auto">
        {/* Search and Filter Container */}
        <div className="flex justify-between items-center mt-24 mb-5">
          <div className="flex justify-center items-center gap-4 mx-auto">
            <Input
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-72 border-customGreen rounded-full border-2 focus:border-customGreen transition-colors duration-300"
            />
            <FilterDropdown filters={filters} onFilterChange={handleFilterChange} />
          </div>
          {/* Add Product Button */}
          <Link to="/products/create">
            <Button type="primary" className="bg-customGreen hover:bg-darkerGreen transition duration-300 mr-14">
              Add Product
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <Row gutter={[16, 16]} className="mt-5">
          {filteredProducts.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out m-4">
                  <img
                      className="w-full h-48 object-cover"
                      src={product.image || 'defaultImageUrl.jpg'}
                      alt={product.name}
                      loading="lazy"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-2xl mb-2 text-gray-800">{product.name}</h3>
                    <StarRating rating={calculateAverageRating(product.ratings)} />
                    <p className="font-semibold text-customGreen">${product.price.toFixed(2)}</p>
                    <div className="h-16 overflow-hidden">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {product.description && product.description.length > 100
                            ? `${product.description.slice(0, 100)}...`
                            : product.description || 'No description available.'}
                      </p>
                    </div>
                  </div>

                  <Link to={`/product/${product._id}`}>
                    <button
                        style={{ backgroundColor: '#02735F', color: 'white' }}
                        className="w-full py-2 mt-2 rounded transition-colors duration-300 hover:bg-darkerGreen"
                    >
                      View Details
                    </button>
                  </Link>
                </div>
              </Col>
          ))}
        </Row>
      </div>
  );
};

export default ProductGrid;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilterDropdown from './filterDropdown';
import StarRating from './starRating'; // Import the StarRating component

const ProductGrid = () => {
  const backURL = process.env.REACT_APP_BACKEND_URL;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
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
    <div>
      {/* Search and Filter Container */}
      <div className="flex justify-center items-center gap-4 mt-24 mb-5">
        <div className="inline-block">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 p-2 border-2 border-customGreen rounded-full text-base focus:outline-none focus:border-customGreen transition-colors duration-300"
          />
        </div>
        <FilterDropdown filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center p-5 mt-5 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="border-4 border-customGreen rounded-lg text-center transition-transform transform hover:scale-105 hover:bg-green-100 shadow-lg flex flex-col justify-between w-64">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-none" />
            <h3 className="text-customGreen mt-1 font-semibold text-lg">{product.name}</h3>
            <div className="flex justify-between items-center w-full mt-1 mb-2">
              <StarRating rating={calculateAverageRating(product.ratings)} /> {/* Display StarRating */}
              <p className="font-semibold text-customGreen">${product.price.toFixed(2)}</p> {/* Price without label */}
            </div>
            <Link to={`/product/${product._id}`}>
              <button className="bg-customGreen text-white w-full py-2 mt-2 transition-colors duration-300 hover:bg-darkerGreen rounded-none">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

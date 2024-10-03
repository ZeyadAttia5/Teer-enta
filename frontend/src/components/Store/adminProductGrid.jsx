import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilterDropdown from './filterDropdown'; // Reusing FilterDropdown

const AdminProductGrid = () => {
  const backURL = process.env.REACT_APP_BACKEND_URL; // Ensure consistent API URL
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
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

  // Handle loading state
  if (loading) {
    return <div className="text-center mt-24">Loading products...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-24">Error: {error}</div>;
  }

  // Filter products based on search term and price range
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    return matchesSearch && matchesPrice;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen p-5 relative">
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
        <FilterDropdown filters={filters} onFilterChange={handleFilterChange} /> {/* Reusing FilterDropdown */}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center mt-5 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="border-4 border-customGreen rounded-lg text-center transition-transform transform hover:scale-105 hover:bg-green-100 shadow-lg flex flex-col justify-between w-64">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-none" />
            <h3 className="text-customGreen mt-1 font-semibold text-lg">{product.name}</h3>
            <div className="flex w-full mt-2">
              <Link to={`/admin/edit-product/${product._id}`} className="flex-1">
                <button className="bg-customGreen text-white w-full py-2 transition-colors duration-300 hover:bg-darkerGreen rounded-none">
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
        ))}
      </div>

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

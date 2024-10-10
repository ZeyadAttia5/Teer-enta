import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FilterDropdown from "./filterDropdown";
import StarRating from "./starRating";
import { Input, Row, Col, Button } from "antd";
import { FaEdit } from "react-icons/fa";
import {getProducts} from "../../api/products.ts";

const AdminProductGrid = ({ setFlag }) => {
  setFlag(false);
  const backURL = process.env.REACT_APP_BACKEND_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    sortBy: "rating", // Default sorting by rating
    sortOrder: "desc" // Default sorting order
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log("Fetched Products:", response.data);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backURL]);

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
  };

  if (loading) {
    return <div className="text-center mt-24">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-24">Error: {error}</div>;
  }

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;
    return matchesSearch && matchesPrice;
  });

  // Sorting the filtered products based on sort order
  filteredProducts = filteredProducts.sort((a, b) => {
    let comparison = 0;

    if (filters.sortBy === "rating") {
      const avgRatingA = calculateAverageRating(a.ratings);
      const avgRatingB = calculateAverageRating(b.ratings);
      comparison = avgRatingA - avgRatingB; // Ascending order for ratings
    } else if (filters.sortBy === "price") {
      comparison = a.price - b.price; // Ascending order for price
    } else if (filters.sortBy === "name") {
      comparison = a.name.localeCompare(b.name); // Ascending order for name
    }

    // Adjusting for sort order
    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
      <div className="container mx-auto p-5 relative">
        <div className="flex justify-between items-center mt-24 mb-5">
          <div className="flex justify-center items-center gap-4 mx-auto">
            <Input
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-72 border-customGreen rounded-full border-2 focus:border-customGreen transition-colors duration-300"
            />
            <FilterDropdown
                filters={filters}
                onFilterChange={handleFilterChange}
            />
          </div>
          {user && (user.userRole === "Admin" || user.userRole === "Seller") && (
              <Link to="/products/create">
                <Button
                    type="primary"
                    className="bg-customGreen hover:bg-darkerGreen transition duration-300 mr-14"
                >
                  Add Product
                </Button>
              </Link>
          )}
        </div>

        <Row gutter={[16, 16]} className="mt-5">
          {filteredProducts.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out m-4">
                  <img
                      className="w-full h-48 object-cover"
                      src={product.image || "defaultImageUrl.jpg"}
                      alt={product.name}
                      loading="lazy"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-xl">{product.name}</h2>
                    <p className="text-gray-700">${product.price.toFixed(2)}</p>
                    <StarRating rating={calculateAverageRating(product.ratings)} />
                    <Link to={`/products/${product._id}`}>
                      <Button
                          className="bg-customGreen hover:bg-darkerGreen text-white mt-2"
                      >
                        View Details
                      </Button>
                    </Link>
                    {user && (user._id === product.createdBy )&&(user.userRole === "Admin" || user.userRole === "Seller") && (
                        <Link to={`/products/edit/${product._id}`}>
                          <FaEdit className="text-customGreen mt-2 cursor-pointer" />
                        </Link>
                    )}
                  </div>
                </div>
              </Col>
          ))}
        </Row>
      </div>
  );
};

export default AdminProductGrid;

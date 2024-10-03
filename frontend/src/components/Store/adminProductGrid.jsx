import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
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
    <div className="min-h-screen p-5 relative"> {/* Ensure the div takes the full height of the screen */}
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
        {/* Optionally include your FilterDropdown here */}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center mt-5 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border-4 border-customGreen rounded-lg text-center transition-transform transform hover:scale-105 hover:bg-green-100 shadow-lg flex flex-col justify-between w-64">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-none" />
            <h3 className="text-customGreen mt-1 font-semibold text-lg">{product.name}</h3> {/* Reduced margin */}
            <div className="flex w-full mt-2"> {/* Flex layout for buttons */}
              <Link to={`/admin/edit-product/${product.id}`} className="flex-1">
                <button className="bg-customGreen text-white w-full py-2 transition-colors duration-300 hover:bg-darkerGreen rounded-none">
                  Edit Product
                </button>
              </Link>
              <Link to={`/product/${product.id}`} className="flex-1">
                <button className="bg-customGreen text-white w-full py-2 transition-colors duration-300 hover:bg-darkerGreen rounded-none">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Product Button */}
      <Link to="/product/form" className="absolute bottom-5 right-5"> {/* Positioning to the bottom right of the page */}
        <button className="bg-customGreen text-white px-4 py-1 transition-colors duration-300 hover:bg-darkerGreen rounded-lg"> {/* Smaller size and rounded corners */}
          Add New Product
        </button>
      </Link>
    </div>
  );
};

export default AdminProductGrid;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://your-api-endpoint.com/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <h2 className="text-center text-2xl font-bold">Product not found!</h2>;

  return (
    <div className="container mx-auto p-8 mt-16 flex flex-col lg:flex-row">
      <div className="flex-shrink-0 mb-6 lg:mb-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg shadow-lg lg:h-96"
        />
      </div>
      <div className="lg:ml-8 mt-4 lg:mt-0">
        <h2 className="text-4xl font-semibold">{product.name}</h2>
        <p className="text-2xl text-green-600 mt-2">${product.price}</p>
        <p className="text-lg text-gray-700 mt-2">{product.description}</p>
        <p className="text-gray-600 mt-2">Seller: <span className="font-medium">{product.createdBy.name}</span></p>
        <p className="text-gray-600 mt-1">Ratings: <span className="font-medium">{product.ratings.length > 0 ? (product.ratings.reduce((acc, cur) => acc + cur.rating, 0) / product.ratings.length).toFixed(1) : 'No ratings'} / 5</span></p>
        
        <h3 className="text-xl font-semibold mt-4">Reviews:</h3>
        <ul className="list-disc ml-5 mt-2">
          {product.reviews.map((review, index) => (
            <li key={index} className="text-gray-700 text-lg">{review.review} - <span className="font-medium">{review.createdBy.name}</span></li>
          ))}
        </ul>

        <Link to="/all-products" className="inline-block mt-6">
          <button className="bg-customGreen text-white px-6 py-3 rounded-md shadow-lg hover:bg-darkerGreen transition duration-300">
            Back to Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import image1 from './sampleImages/pic1.jpg';
import image2 from './sampleImages/pic2.jpg';
import image3 from './sampleImages/pic3.jpg';
import image4 from './sampleImages/pic4.jpg';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const products = [
    { id: 1, name: 'Hagia Sophia Magnet', image: image1, price: 100, description: 'A beautiful magnet of Hagia Sophia.', seller: 'Turkish Souvenirs', ratings: 4.5, reviews: ['Great quality!', 'Perfect souvenir!'] },
    { id: 2, name: 'Decorated Plate', image: image2, price: 30, description: 'A hand-painted decorative plate.', seller: 'Crafts Shop', ratings: 4.0, reviews: ['Lovely craftsmanship!', 'Good price.'] },
    { id: 3, name: 'Magnets', image: image3, price: 40, description: 'Set of fridge magnets.', seller: 'Local Artisans', ratings: 4.7, reviews: ['So cute!', 'Nice addition to my collection.'] },
    { id: 4, name: 'Amulet', image: image4, price: 50, description: 'An authentic Turkish amulet.', seller: 'Turkish Souvenirs', ratings: 4.3, reviews: ['Love the design.', 'Beautiful colors.'] },
  ];

  const product = products.find((p) => p.id === parseInt(id));

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
        <p className="text-gray-600 mt-2">Seller: <span className="font-medium">{product.seller}</span></p>
        <p className="text-gray-600 mt-1">Ratings: <span className="font-medium">{product.ratings} / 5</span></p>
        
        <h3 className="text-xl font-semibold mt-4">Reviews:</h3>
        <ul className="list-disc ml-5 mt-2">
          {product.reviews.map((review, index) => (
            <li key={index} className="text-gray-700 text-lg">{review}</li>
          ))}
        </ul>

        <Link to="/" className="inline-block mt-6">
          <button className="bg-customGreen text-white px-6 py-3 rounded-md shadow-lg hover:bg-darkerGreen transition duration-300">
            Back to Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;

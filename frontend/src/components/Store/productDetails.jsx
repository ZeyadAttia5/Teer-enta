// ProductDetails.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './productDetails.css';
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

  if (!product) return <h2>Product not found!</h2>;

  return (
    <div className="product-details">
      <div className="product-details-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-details-info">
        <h2>{product.name}</h2>
        <p className="price">${product.price}</p>
        <p className="description">{product.description}</p>
        <p className="seller">Seller: {product.seller}</p>
        <p className="ratings">Ratings: {product.ratings} / 5</p>
        <h3>Reviews:</h3>
        <ul>
          {product.reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
        <Link to="/">
          <button className="back-button">Back to Products</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;

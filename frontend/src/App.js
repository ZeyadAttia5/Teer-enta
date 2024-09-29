// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Store/navbar';
import ProductGrid from './components/Store/productGrid';
import ProductDetails from './components/Store/productDetails';  // Import the new ProductDetails component
import AdminProductForm from './components/Store/adminProductForm';
import AdminProductGrid from './components/Store/adminProductGrid'; 
import EditProductForm from './components/Store/editProductForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/product/:id" element={<ProductDetails />} />  
        <Route path="/product/form" element={<AdminProductForm />} />  
        <Route path="/product/adminGrid" element={<AdminProductGrid />} />  
        <Route path="/admin/edit-product/:productId" element={<EditProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;

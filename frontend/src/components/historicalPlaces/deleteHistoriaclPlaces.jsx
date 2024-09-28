import React from 'react';
import historicalPlacesData from './historicalPlacesData'; 
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const DeleteHistoricalPlaces = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const handleDeleteHistoricalPlace = () => {
    const index = historicalPlacesData.findIndex(place => place._id === id);
    
    if (index !== -1) {
      historicalPlacesData.splice(index, 1);
      toast.success("Historical place deleted successfully!");
    } else {
      toast.error("Historical place not found!");
    }
  
    navigate('/');
  };
  

  return (
    <div className='p-4'>
      <h1 className='text-3xl my-4'>Delete Historical Place</h1>
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are you sure you want to delete this historical place?</h3>
        <button 
          className='p-4 bg-red-600 m-8 rounded-xl hover:bg-red-700 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' 
          onClick={handleDeleteHistoricalPlace}
        >
          Yes, Delete It
        </button>
      </div>
    </div>
  );
};

export default DeleteHistoricalPlaces;

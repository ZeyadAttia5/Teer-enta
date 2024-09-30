import React,{useState, useEffect} from 'react';
// import historicalPlacesData from './historicalPlacesData'; 
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';


const PORT = process.env.PORT || 8000;

const DeleteHistoricalPlaces = () => {
  const navigate = useNavigate();

  const { id } = useParams(); 

  const handleDeleteHistoricalPlace = async () => {
    try {
      const response = await axios.delete(`http://localhost:${PORT}/historicalPlace/delete/${id}`);
      
      if (response.status === 200) {
        toast.success('Historical place deleted successfully!');
        navigate('/historicalPlace');
      } else {
        toast.error('Failed to delete the historical place.');
      }
    } catch (error) {
      console.error('Error deleting historical place:', error);
      toast.error('An error occurred while deleting the historical place.');
    }
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

import React, { useState,useEffect } from 'react';
import HistoricalPlaceSingleCard from './historicalPlaceSingleCard';
import { MdOutlineAddBox } from 'react-icons/md'
import { Link } from 'react-router-dom'
import axios from 'axios'

const PORT = process.env.PORT || 8000;

const ReadHistoriaclPlaces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [historicalPlacesData, setHistoricalPlacesData] = useState([]);

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/historicalPlace`);
        setHistoricalPlacesData(response.data); 
      } catch (error) {
        console.error('Error fetching historical places:', error);
      }
    };

    fetchHistoricalPlaces();
  }, []);



  const tags = [...new Set(historicalPlacesData.flatMap(place => place.tags.map(tag => tag.type)))];

  const filteredPlaces = historicalPlacesData.filter((place) => 
    (selectedTag ? place.tags.some(tag => tag.type === selectedTag) : true) && 
    ((place.name && place.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (place.location && place.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (place.tags.some(tag => tag.type.toLowerCase().includes(searchTerm.toLowerCase()))))
  );

  return (
    <div className="p-16 bg-gray-100">
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by name, location, or tag..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border border-slate-700 rounded-md w-[600px] mx-auto block"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="tagFilter" className="mr-4 font-semibold">Filter by Tag:</label>
        <select
          id="tagFilter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 border border-slate-700 rounded-md cursor-pointer"
        >
          <option value="">All Tags</option>
          {tags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end p-4 w-full">
        <Link to='/historicalPlace/create'>
          <button className="flex items-center px-4 py-2 bg-sky-800 text-white rounded-lg shadow hover:bg-sky-700 hover:scale-105 transition-all duration-300 ease-in-out">
            <span className="mr-2">Create New</span>
            <MdOutlineAddBox className='text-2xl' />
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlaces.map((place, index) => (
          <HistoricalPlaceSingleCard
            key={index}
            places={place}
          />
        ))}
      </div>
    </div>
  );
}

export default ReadHistoriaclPlaces
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {getHistoricalPlace} from "../../api/historicalPlaces.ts";
import { useParams } from 'react-router-dom';
import ShareButton from '../shared/ShareButton.js';


const PORT = process.env.REACT_APP_BACKEND_URL;

const ShowHistoricalPlaces = () => {
  const { id } = useParams();
  const [historicalPlace, setHistoricalPlace] = useState(null);

  useEffect(() => {
    const fetchHistoricalPlace = async () => {
      try {
        const response= await getHistoricalPlace(id);
        setHistoricalPlace(response.data);
      } catch (error) {
        console.error("Error fetching historical place details:", error);
      }
    };
    fetchHistoricalPlace();
  }, [id]);

  if (!historicalPlace) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  const shareLink = `${window.location.origin}/historicalPlace/details/${id}`;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 pb-10 mb-16 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-700 text-center">{historicalPlace.name}</h2>

      <div className="flex justify-center mb-6">
        <ShareButton shareLink={shareLink} />
      </div>

      {/* Image section */}
      {historicalPlace.images && historicalPlace.images.length > 0 && (
        <div className="mb-8">
          <img
            className="w-full h-64 object-cover rounded-lg shadow-md"
            src={historicalPlace.images[0]} // Display the first image
            alt={historicalPlace.name}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-600">Opening Hours</h3>
          <p className="text-gray-700">{historicalPlace.openingHours}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-600">Location</h3>
          <p className="text-gray-700">{historicalPlace.location}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-2 text-gray-600">Description</h3>
          <p className="text-gray-700">{historicalPlace.description}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-2 text-gray-600">Tags</h3>
          <ul className="space-y-2">
            {historicalPlace.tags.map((tag, index) => (
              <li key={index} className="flex justify-between bg-gray-100 p-3 rounded-md">
                <span className="font-medium text-gray-800">{tag.name}</span>
                <span className="font-semibold text-gray-600">({tag.type}, {tag.historicalPeriod})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-2 text-gray-600">Tickets</h3>
          {historicalPlace.tickets.length > 0 ? (
            <ul className="space-y-2">
              {historicalPlace.tickets.map((ticket, index) => (
                <li key={index} className="flex justify-between bg-gray-100 p-3 rounded-md">
                  <span className="font-medium text-gray-800">{ticket.type}</span>
                  <span className="font-semibold text-gray-600">${ticket.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No tickets available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowHistoricalPlaces;


import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";

const HistoricalPlaceSingleCard = ({ places }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.userRole;

  return (
    <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out m-4">
      <img
        className="w-full h-48 object-cover"
        src={
          places.images && places.images.length > 0
            ? places.images[0]
            : "defaultImageUrl.jpg"
        }
        alt={places.name}
        loading="lazy"
      />
      <div className="p-6">
        <h3 className="font-bold text-2xl mb-2 text-gray-800">{places.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {places.description.length > 120
            ? places.description.slice(0, 100) + "..."
            : places.description}
        </p>

        <div className="mb-4">
          <span className="inline-block text-sm text-gray-500 font-medium">
            Opening Hours: {places.openingHours}
          </span>
        </div>

        <div className="mb-4">
          <h4 className="font-bold text-gray-700 mb-2">Ticket Prices:</h4>
          {places.tickets.map((ticket, index) => (
            <div key={ticket.type + index} className="text-gray-600 text-sm">
              <span className="font-medium">{ticket.type}:</span> $
              {ticket.price}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-4 flex flex-wrap">
        <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-xs font-medium text-blue-600 mr-2 mb-2">
          {places.location}
        </span>
        {places.tags &&
          places.tags.map((tag, index) => (
            <div key={tag.name + index}>
              <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-xs font-medium text-green-600 mr-2 mb-2">
                {tag.name}
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-400 mr-2 mb-2">
                {tag.type}
              </span>
            </div>
          ))}
      </div>
      {user._id === places.createdBy && (
        <div className="flex justify-center items-center gap-10 mt-4 p-4">
          <Link to={`/historicalPlace/update/${places._id}`}>
            <AiOutlineEdit
              className="text-yellow-600 text-2xl hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
              title="Edit"
            />
          </Link>
          <Link to={`/historicalPlace/delete/${places._id}`}>
            <MdOutlineDelete
              className="text-red-600 text-2xl hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
              title="Delete"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default HistoricalPlaceSingleCard;

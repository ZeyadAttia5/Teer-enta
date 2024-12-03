import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { deleteHistoricalPlace } from "../../api/historicalPlaces.ts";

const HistoricalPlaceSingleCard = ({ currency, places }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = places._id;

  const handleDeleteHistoricalPlace = async () => {
    try {
      const response = await deleteHistoricalPlace(id);
      if (response.status === 200) {
        toast.success("Historical place deleted successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to delete the historical place.");
      }
    } catch (error) {
      console.error("Error deleting historical place:", error);
      toast.error("An error occurred while deleting the historical place.");
    }
  };

  return (
    <Link to={`/historicalPlace/details/${places?._id}`}>
      <div className="max-w-sm w-full h-[26rem] rounded-lg overflow-hidden shadow-lg bg-white transform hover:shadow-xl transition-all duration-300 ease-in-out m-4">
        <img
          className="w-full h-40 object-cover"
          src={
            places?.images && places?.images?.length > 0
              ? places?.images[0]
              : "defaultImageUrl.jpg"
          }
          alt={places?.name}
          loading="lazy"
        />
        <div className="p-4 flex flex-col h-[calc(100%-10rem)]">
          <h3 className="font-bold text-xl mb-2 text-[#496989] truncate">
            {places?.name}
          </h3>

          <div className="mb-2 text-sm">
            <span className="text-gray-500 font-medium">
              Opening Hours: {places?.openingHours}
            </span>
          </div>

          <div className="mb-4 overflow-auto">
            <h4 className="font-bold text-gray-700 mb-1 text-sm">Ticket Prices:</h4>
            {places?.tickets?.map((ticket, index) => (
              <div key={ticket.type + index} className="text-gray-600 text-xs">
                <span className="font-medium">{ticket?.type}:</span>{" "}
                {(currency?.rate * ticket?.price).toFixed(2)} {currency?.code}
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap overflow-hidden">
              <span className="inline-block bg-blue-100 rounded-full px-2 py-1 text-xs font-medium text-blue-600 mr-1 mb-1">
                {places?.location}
              </span>
              {places?.tags &&
                places?.tags?.map((tag, index) => (
                  <React.Fragment key={tag.name + index}>
                    <span className="inline-block bg-green-100 rounded-full px-2 py-1 text-xs font-medium text-green-600 mr-1 mb-1">
                      {tag.name}
                    </span>
                    <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-medium text-gray-400 mr-1 mb-1">
                      {tag.type}
                    </span>
                    <span className="inline-block bg-yellow-100 rounded-full px-2 py-1 text-xs font-medium text-yellow-600 mr-1 mb-1">
                      {tag.historicalPeriod}
                    </span>
                  </React.Fragment>
                ))}
            </div>

            {user &&
              user.userRole === "TourismGovernor" &&
              user._id === places.createdBy && (
                <div className="flex justify-center items-center gap-x-4 mt-2">
                  <Link to={`/historicalPlace/update/${places?._id}`}>
                    <div className="flex justify-center items-center w-8 h-8 text-yellow-600 hover:text-black hover:scale-105 transition duration-300 ease-in-out">
                      <AiOutlineEdit className="text-xl" title="Edit" />
                    </div>
                  </Link>
                  <button onClick={handleDeleteHistoricalPlace}>
                    <div className="flex justify-center items-center w-8 h-8 text-red-600 hover:text-black hover:scale-105 transition duration-300 ease-in-out">
                      <MdOutlineDelete className="text-xl" title="Delete" />
                    </div>
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HistoricalPlaceSingleCard;


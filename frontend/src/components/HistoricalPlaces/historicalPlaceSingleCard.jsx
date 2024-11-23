import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {AiOutlineEdit} from "react-icons/ai";
import {MdOutlineDelete} from "react-icons/md";
import {BsInfoCircle} from 'react-icons/bs';
import axios from "axios";
import {toast} from "react-hot-toast";
import {deleteHistoricalPlace} from "../../api/historicalPlaces.ts";
import {getCurrency} from "../../api/account.ts";

const PORT = process.env.REACT_APP_BACKEND_URL;

const HistoricalPlaceSingleCard = ({currency, places}) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const id = places._id;
    const accessToken = localStorage.getItem('accessToken');


    const handleDeleteHistoricalPlace = async () => {
        try {
            const response = await deleteHistoricalPlace(id)
            if (response.status === 200) {
                toast.success('Historical place deleted successfully!');
                window.location.reload();
            } else {
                toast.error('Failed to delete the historical place.');
            }
        } catch (error) {
            console.error('Error deleting historical place:', error);
            toast.error('An error occurred while deleting the historical place.');
        }
    };

    return (
        <Link to={`/historicalPlace/details/${places?._id}`}>
        <div
            className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform  hover:shadow-xl transition-all duration-300 ease-in-out m-4">
            <img
                className="w-full h-48 object-cover"
                src={
                    places?.images && places?.images?.length > 0
                        ? places?.images[0]
                        : "defaultImageUrl.jpg"
                }
                alt={places?.name}
                loading="lazy"
            />
            <div className="p-6">
                <h3 className="font-bold text-2xl mb-2 text-[#496989]">{places?.name}</h3>
                {/* <p className="text-[#58A399] text-sm leading-relaxed mb-4">
                    {places.description.length > 120
                        ? places.description.slice(0, 100) + "..."
                        : places.description}
                </p> */}

                <div className="mb-4">
                <span className="inline-block text-sm text-gray-500 font-medium">
                    Opening Hours: {places?.openingHours}
                </span>
                </div>

                <div className="mb-4">
                    <h4 className="font-bold text-gray-700 mb-2">Ticket Prices:</h4>
                    {places?.tickets?.map((ticket, index) => (
                        <div key={ticket.type + index} className="text-gray-600 text-sm">
                            <span
                                className="font-medium">{ticket?.type}:</span> {(currency?.rate * ticket?.price).toFixed(2)} {currency?.code}
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 pb-4 flex flex-wrap">
            <span
                className="inline-block bg-blue-100 rounded-full px-3 py-1 text-xs font-medium text-blue-600 mr-2 mb-2">
                {places?.location}
            </span>
                {places?.tags &&
                    places?.tags?.map((tag, index) => (
                        <div key={tag.name + index}>
                        <span
                            className="inline-block bg-green-100 rounded-full px-3 py-1 text-xs font-medium text-green-600 mr-2 mb-2">
                            {tag.name}
                        </span>
                            <span
                                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-400 mr-2 mb-2">
                            {tag.type}
                        </span>
                            <span
                                className="inline-block bg-yellow-100 rounded-full px-3 py-1 text-xs font-medium text-yellow-600 mr-2 mb-2">
                            {tag.historicalPeriod}
                        </span>
                        </div>
                    ))}
            </div>

                {(user && (user.userRole === "TourismGovernor") && user._id === places.createdBy) && (
            <div className="flex justify-center items-center gap-x-4 p-4">
                    <div className="flex gap-4">
                        <Link to={`/historicalPlace/update/${places?._id}`}>
                            <div
                                className="flex justify-center items-center w-10 h-10 text-yellow-600 hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                                <AiOutlineEdit className="text-2xl" title="Edit"/>
                            </div>
                        </Link>
                        <button onClick={handleDeleteHistoricalPlace}>
                            <div
                                className="flex justify-center items-center w-10 h-10 text-red-600 hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                                <MdOutlineDelete className="text-2xl" title="Delete"/>
                            </div>
                        </button>
                    </div>

                {/* <Link to={`/historicalPlace/details/${places._id}`}>
                    <div
                        className="flex justify-center items-center w-10 h-10 text-green-800 hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                        <BsInfoCircle className="text-2xl" title='Details'/>
                    </div>
                </Link> */}
            </div>
                )}
        </div>
        </Link>
    );
}
export default HistoricalPlaceSingleCard;
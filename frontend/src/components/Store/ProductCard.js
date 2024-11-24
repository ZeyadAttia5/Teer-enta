import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { deleteHistoricalPlace } from "../../api/historicalPlaces.ts";
import { getCurrency } from "../../api/account.ts";

const PORT = process.env.REACT_APP_BACKEND_URL;

const ProductCard = ({ currency, product }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = product._id;
  const accessToken = localStorage.getItem("accessToken");

  return (
    <Link to={`/products/${id}}`}>
      <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform  hover:shadow-xl transition-all duration-300 ease-in-out m-4">
        <img
          className="w-full h-48 object-cover"
          src={
            product?.images && product?.images?.length > 0
              ? product?.images[0]
              : "defaultImageUrl.jpg"
          }
          alt={product?.name}
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="font-bold text-2xl mb-2 text-[#496989]">
            {product?.name}
          </h3>
        </div>

        <div className="px-6 pb-4 flex flex-wrap">
          <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-xs font-medium text-blue-600 mr-2 mb-2">
            {places?.location}
          </span>
          {places?.tags &&
            places?.tags?.map((tag, index) => (
              <div key={tag.name + index}>
                <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-xs font-medium text-green-600 mr-2 mb-2">
                  {tag.name}
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-400 mr-2 mb-2">
                  {tag.type}
                </span>
                <span className="inline-block bg-yellow-100 rounded-full px-3 py-1 text-xs font-medium text-yellow-600 mr-2 mb-2">
                  {tag.historicalPeriod}
                </span>
              </div>
            ))}
        </div>

        {user &&
          user.userRole === "TourismGovernor" &&
          user._id === places.createdBy && (
            <div className="flex justify-center items-center gap-x-4 p-4">
              <div className="flex gap-4">
                <Link to={`/historicalPlace/update/${places?._id}`}>
                  <div className="flex justify-center items-center w-10 h-10 text-yellow-600 hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                    <AiOutlineEdit className="text-2xl" title="Edit" />
                  </div>
                </Link>
                <button onClick={handleDeleteHistoricalPlace}>
                  <div className="flex justify-center items-center w-10 h-10 text-red-600 hover:text-black hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
                    <MdOutlineDelete className="text-2xl" title="Delete" />
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
};
export default ProductCard;

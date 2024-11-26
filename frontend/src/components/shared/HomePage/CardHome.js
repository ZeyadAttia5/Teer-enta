import React from "react";

const CardHome = ({ title, image, description }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <img src={image} alt={title} className="w-full rounded" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default CardHome;

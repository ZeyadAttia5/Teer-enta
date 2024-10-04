import React from "react";
import PreviousWorkCard from "./PreviousWorkCard"; // Import the card component

const PreviousWorksList = ({ previousWorks, onDelete }) => {
  console.log("prev works are: "+previousWorks);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Previous Works</h2>
      {previousWorks.length > 0 ? (
        previousWorks.map((work, index) => (
          <PreviousWorkCard index={index} work={work} onDelete={onDelete} />
        ))
      ) : (
        <p className="text-gray-500">No previous works available.</p>
      )}
    </div>
  );
};

export default PreviousWorksList;

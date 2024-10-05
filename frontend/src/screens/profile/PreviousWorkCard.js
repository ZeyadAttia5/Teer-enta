import React from "react";
import { FaTrash } from "react-icons/fa"; // Importing the delete icon from react-icons

const PreviousWorkCard = ({index, work, onDelete }) => {
  const { jobTitle, jobDescription, timeLine } = work;

  // Check if timeLine is defined and has at least one entry
  const firstTimeLine = timeLine && timeLine.length > 0 ? timeLine[0] : null;

  // Extracting start and end time if firstTimeLine exists
  const startTime = firstTimeLine ? firstTimeLine.startTime : "N/A";
  const endTime = firstTimeLine ? firstTimeLine.endTime : "N/A";
  console.log("key is: "+index);
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold mb-2">{jobTitle}</h3>
        <p className="text-gray-600 mb-2">{jobDescription}</p>
        <p className="text-gray-500">
          {startTime !== "N/A" && endTime !== "N/A"
            ? `${new Date(startTime).toLocaleDateString()} - ${new Date(endTime).toLocaleDateString()}`
            : "Date information not available."}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(index)}
        className="text-red-500 hover:text-red-700 focus:outline-none ml-4"
        aria-label="Delete previous work"
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default PreviousWorkCard;

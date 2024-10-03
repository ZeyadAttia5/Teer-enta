import React from "react";

const PreviousWorkCard = ({ work }) => {
  const { jobTitle, jobDescription, timeLine } = work;

  // Check if timeLine is defined and has at least one entry
  const firstTimeLine = timeLine && timeLine.length > 0 ? timeLine[0] : null;

  // Extracting start and end time if firstTimeLine exists
  const startTime = firstTimeLine ? firstTimeLine.startTime : "N/A";
  const endTime = firstTimeLine ? firstTimeLine.endTime : "N/A";
    console.log("start time"+startTime);    
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{jobTitle}</h3>
      <p className="text-gray-600 mb-2">{jobDescription}</p>
      <p className="text-gray-500">
        {startTime !== "N/A" && endTime !== "N/A"
          ? `${new Date(startTime).toLocaleDateString()} - ${new Date(endTime).toLocaleDateString()}`
          : "Date information not available."}
      </p>
    </div>
  );
};

export default PreviousWorkCard;

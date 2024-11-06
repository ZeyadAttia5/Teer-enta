import React, { useState } from "react";
import ConfirmationModal from "../../shared/ConfirmationModal";

const AddPreviousWork = ({ onAddWork, cancelWork }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const valid = () => {
    if ( jobTitle === "" || jobDescription === "" || new Date(startTime) > new Date(endTime)) {
      setModalOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!valid()){
      return false;
    }
    const newWork = {
      jobTitle,
      jobDescription,
      timeLine: [
        {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      ],
    };
    
    onAddWork(newWork);

    // Clear the form
    setJobTitle("");
    setJobDescription("");
    setStartTime("");
    setEndTime("");
  };
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <form className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        
        message={`Enter valid values`}
      />
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Job Title:
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Job Description:
        </label>
        <input
          type="text"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Start Date:
        </label>
        <input
          type="date" // Changed from datetime-local to date
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          End Date:
        </label>
        <input
          type="date" // Changed from datetime-local to date
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="flex gap-6">
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleSubmit}
        >
          Confirm
        </button>
        <button
          type=""
          className="w-full bg-gray-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-red-300"
          onClick={cancelWork}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddPreviousWork;

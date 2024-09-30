import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import unknownImage from "./unknown.jpg";
import axios from "axios";

// async function getProfileData() {
//   try {
//     const response = await axios.get(`${URL}/profile/${id}`);

//     setMessage(response.data.message);
//   } catch (error) {
//     setMessage(error.response.data.message || 'Getting data failed');
//   }
// }

function Profile() {
  const URL = `http://localhost:${process.env.PORT}`;
  const [message, setMessage] = useState("");

  // const location = useLocation();
  // const { userData } = location.state || {};
  // const username = userData.username;
  // const email = userData.email;
  // const mobileNumber = userData.mobileNumber;
  // const jobTitle = userData.jobTitle;
  // const dob = userData.dob;
  // const role = userData.role;

  return (
    <div className="flex m-16">
      <div className="">
        <div className="border-2 border-[#02735f]">
          <div className="border-2 border-white">
            {/* <img width={200} src={unknownImage} alt={`${username}'s profile`} className="border-2 border-[#02735f]" /> */}
            <img
              width={200}
              src={unknownImage}
              alt={`user's profile`}
              className="border-2 border-[#02735f]"
            />
          </div>

          
        </div>
        <div className="flex flex-col space-y-4 mt-4">
            <button className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
              <i className="fas fa-edit mr-2"></i>
              Edit Profile
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300">
              <i className="fas fa-wallet mr-2"></i>
              View Wallet
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300">
              <i className="fas fa-exclamation-circle mr-2"></i>
              Complaint
            </button>
          </div>
        <div></div>
      </div>
      <div></div>
    </div>
  );
}

export default Profile;

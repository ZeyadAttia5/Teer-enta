import React from "react";
import { useLocation } from "react-router-dom";
import unknownImage from '../../assets/unknown.jpg';

function Profile() {
  const location = useLocation();
  const { userData } = location.state || {};
  const username = userData.username;
  const email = userData.email;
  const mobileNumber = userData.mobileNumber;
  const jobTitle = userData.jobTitle;
  const dob = userData.dob;
  const role = userData.role;

  return (
    <div className="flex m-16">
      <div className="">
        <div className="border-2 border-[#02735f]">
        <div className="border-2 border-white">
          <img width={200} src={unknownImage} alt={`${username}'s profile`} className="border-2 border-[#02735f]" />
        </div>
        </div>
        <div>

        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Profile;

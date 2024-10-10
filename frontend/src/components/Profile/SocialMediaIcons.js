// SocialMediaIcons.js
import React, { useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // X (formerly Twitter) uses different icons

export default function SocialMediaIcons({setFacebook, isReadOnly, setInstagram, setLinkedin, setTwitter,
  facebook, instagram, linkedin, twitter
}) {
  const iconStyles = "text-white text-2xl mx-2 hover:text-blue-500";
  const [facebookName, setFacebookName] = useState(facebook); // State for Facebook URL
  const [linkedinName, setLinkedinName] = useState(linkedin); // State for LinkedIn URL
  const [twitterName, setTwitterName] = useState(twitter); // State for Twitter URL
  const [instagramName, setInstagramName] = useState(instagram); // State for Instagram URL

  const handleFacebook = (e) => {
    setFacebookName(e.target.value);
    setFacebook(e.target.value);
  }
  const handleLinkedin = (e) => {
    setLinkedinName(e.target.value);
    setLinkedin(e.target.value);
  }
  const handleTwitter = (e) => {
    setTwitterName(e.target.value);
    setTwitter(e.target.value);
  }
  const handleInstagram = (e) => {
    setInstagramName(e.target.value);
    setInstagram(e.target.value);
  }

  return (
    <div className="flex flex-col justify-center gap-2 w-fit">
      {/* Facebook */}
      <div className="relative bg-blue-600 p-3  rounded-full hover:bg-blue-700 transition duration-300">
        <FaFacebookF className={`inline ${iconStyles}`} />
        <input
          type="text"
          value={facebookName}
          readOnly={isReadOnly}
          onChange={handleFacebook} // Assuming you're using state for `facebook`
          className="bg-transparent border-none text-white ml-2 focus:outline-none w-fit" // Styling input
          placeholder={!isReadOnly ? "Enter Facebook URL" : ""}
        />
      </div>

      {/* LinkedIn */}
      {/* LinkedIn */}
      <div className="relative bg-blue-800 p-3  rounded-full hover:bg-blue-900 transition duration-300">
        <FaLinkedinIn className={`inline ${iconStyles}`} />
        <input
          type="text"
          value={linkedinName}
          readOnly={isReadOnly}
          onChange={handleLinkedin} // Assuming state management
          className="bg-transparent border-none text-white ml-2 focus:outline-none"
          placeholder={!isReadOnly ? "Enter LinkedIn URL" : ""}
        />
      </div>

      {/* Twitter (X) */}
      <div className="relative bg-gray-800 p-3  rounded-full hover:bg-gray-900 transition duration-300">
        <FaXTwitter className={`inline ${iconStyles}`} />
        <input
          type="text"
          value={twitterName}
          readOnly={isReadOnly}
          onChange={handleTwitter}
          className="bg-transparent border-none text-white ml-2 focus:outline-none"
          placeholder={!isReadOnly ? "Enter Twitter URL" : ""}
        />
      </div>

      {/* Instagram */}
      <div className="relative bg-pink-500 p-3  rounded-full hover:bg-pink-600 transition duration-300">
        <FaInstagram className={`inline ${iconStyles}`} />
        <input
          type="text"
          value={instagramName}
          readOnly={isReadOnly}
          onChange={handleInstagram}
          className="bg-transparent border-none text-white ml-2 focus:outline-none"
          placeholder={!isReadOnly ? "Enter Instagram URL" : ""}
        />
      </div>
    </div>
  );
}

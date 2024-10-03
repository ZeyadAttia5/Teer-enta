// SocialMediaIcons.js
import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // X (formerly Twitter) uses different icons

export default function SocialMediaIcons(props) {
  const iconStyles = "text-white text-2xl mx-2 hover:text-blue-500";

  return (
    <div className="flex flex-col justify-center space-x-4 w-fit">
      {/* Facebook */}
      <a
        href={props.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 p-3 cursor-pointer rounded-full hover:bg-blue-700 transition duration-300"
      >
        <FaFacebookF className={`inline ${iconStyles}`} />
        <span className="text-white">Youssef Magdy</span>
      </a>

      {/* LinkedIn */}
      <a
        href={props.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-800 p-3 cursor-pointer rounded-full hover:bg-blue-900 transition duration-300"
      >
        <FaLinkedinIn className={iconStyles} />
      </a>

      {/* X (Twitter) */}
      <a
        href={props.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-800 p-3 cursor-pointer rounded-full hover:bg-gray-900 transition duration-300"
      >
        <FaXTwitter className={iconStyles} />
      </a>

      {/* Instagram */}
      <a
        href={props.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-pink-500 p-3 cursor-pointer rounded-full hover:bg-pink-600 transition duration-300"
      >
        <FaInstagram className={iconStyles} />
      </a>
    </div>
  );
}

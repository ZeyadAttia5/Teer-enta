import React, { useState, useEffect } from "react";
import "./login.css";
import { images } from "./loadImage.js";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Example icons from react-icons
import { FaExclamationCircle } from "react-icons/fa";
function Login() {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);
  return (
    <div className="flex">
      <div className="relative w-2/3 h-screen overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-500 ${
                currentImageIndex === index ? "bg-gray-100" : "bg-gray-400"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <form class="formlogin bg-white block p-4 max-w-[500px] rounded-lg shadow-md">
          <p className="text-4xl font-bold my-4">Login now</p>
          <p className="my-2">Hi, Welcome back </p>

          <div className="flex items-center pt-4 pl-3 pr-3 text-sm leading-5 text-gray-400 mb-4">
            <div className="h-px flex-1 bg-gray-400 text-gray-800"></div>
            <p className="pl-3 pr-3 text-sm leading-5 text-gray-400">Login with Email</p>
            <div className="h-px flex-1 bg-gray-400 text-gray-800"></div>
          </div>

          <h6 className="text-sm font-medium text-gray-700">Email</h6>
          <div className="input-containerlogin relative">
            <input
            className="inputlogin"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              style={{
                border: isValidEmail ? "1px solid #ccc" : "1px solid red",
              }}
            />
            {!isValidEmail && (
              <FaExclamationCircle
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "red",
                }}
              />
            )}
          </div>

          <h6 className="text-sm font-medium text-gray-700">Password</h6>
          <div className="input-containerlogin relative">
          <input
          className="inputlogin"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        style={{
          paddingRight: '40px', // Extra space for the icon
        }}
      />
      <span
        onClick={togglePasswordVisibility}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
        }}
      >
        {showPassword ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
      </span>
          </div>
          <div className="flex justify-end mt-1 mb-4">
            <a className="hover:underline text-[#474bca] text-xs" href="">
              Forgot password?
            </a>
          </div>
          <button type="submit" className="buttonlogin bg-[#02735f] block pt-3 pb-3 pl-5 pr-5 text-white text-sm leading-5 font-medium w-full rounded-lg uppercase">
            Login
          </button>

          <p class="text-xs text-center">
            No account?
            <a href="" className="text-[#474bca] hover:underline">
              {" "}
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

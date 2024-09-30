import React, { useState } from "react";
import "./signup.css";
import Select from "react-select";
import Toggle from "../../components/signup/Toggle.js";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import axios from 'axios';
function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState("");
  const handleUsernameChange = (event) => {
    setUsername(event.target.value); // Update the username state
  };
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  const [passwordMatch, setPasswordMatch] = useState(true);

  const [mobileNumber, setMobileNumber] = useState("");
  const handleMobileNumberChange = (event) => {
    const value = event.target.value;
    const numericRegex = /^[0-9]*$/; // Regular expression to match only numeric characters

    if (numericRegex.test(value)) {
      setMobileNumber(value); // Update the mobile number state if the value is numeric
    }
  };
  const [jobTitle, setJobTitle] = useState("");
  const handleJobTitleChange = (event) => {
    setJobTitle(event.target.value); // Update the job title state
  };
  const [dob, setDob] = useState("");
  const handleDobChange = (event) => {
    setDob(event.target.value); // Update the date of birth state
  };
  const [password, setPassword] = useState("");
  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // Update the password state
    if (confirmPassword === event.target.value) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value); // Update the confirm password state
    if (password === event.target.value) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Tourist");
  const handleNationalityChange = (selectedNationality) => {
    setSelectedNationality(selectedNationality);
  };
  const handleRoleChange = (event) => {
    setSelectedRole(event);
  };

 

  const options = [
    { value: "united-states", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "united-kingdom", label: "United Kingdom" },
    { value: "australia", label: "Australia" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "india", label: "India" },
    { value: "china", label: "China" },
    { value: "japan", label: "Japan" },
    { value: "brazil", label: "Brazil" },
    { value: "argentina", label: "Argentina" },
    { value: "mexico", label: "Mexico" },
    { value: "south-africa", label: "South Africa" },
    { value: "russia", label: "Russia" },
    { value: "italy", label: "Italy" },
    { value: "spain", label: "Spain" },
    { value: "south-korea", label: "South Korea" },
    { value: "indonesia", label: "Indonesia" },
    { value: "saudi-arabia", label: "Saudi Arabia" },
    { value: "turkey", label: "Turkey" },
    { value: "netherlands", label: "Netherlands" },
    { value: "switzerland", label: "Switzerland" },
    { value: "sweden", label: "Sweden" },
    { value: "belgium", label: "Belgium" },
    { value: "norway", label: "Norway" },
    { value: "denmark", label: "Denmark" },
    { value: "finland", label: "Finland" },
    { value: "poland", label: "Poland" },
    { value: "austria", label: "Austria" },
    { value: "ireland", label: "Ireland" },
    { value: "new-zealand", label: "New Zealand" },
    { value: "portugal", label: "Portugal" },
    { value: "greece", label: "Greece" },
    { value: "hungary", label: "Hungary" },
    { value: "czech-republic", label: "Czech Republic" },
    { value: "romania", label: "Romania" },
    { value: "chile", label: "Chile" },
    { value: "colombia", label: "Colombia" },
    { value: "peru", label: "Peru" },
    { value: "venezuela", label: "Venezuela" },
    { value: "malaysia", label: "Malaysia" },
    { value: "singapore", label: "Singapore" },
    { value: "thailand", label: "Thailand" },
    { value: "philippines", label: "Philippines" },
    { value: "vietnam", label: "Vietnam" },
    { value: "pakistan", label: "Pakistan" },
    { value: "bangladesh", label: "Bangladesh" },
    { value: "egypt", label: "Egypt" },
    { value: "nigeria", label: "Nigeria" },
    { value: "kenya", label: "Kenya" },
    { value: "ethiopia", label: "Ethiopia" },
    { value: "morocco", label: "Morocco" },
    { value: "algeria", label: "Algeria" },
    { value: "tunisia", label: "Tunisia" },
    { value: "israel", label: "Israel" },
    { value: "iran", label: "Iran" },
    { value: "iraq", label: "Iraq" },
    { value: "syria", label: "Syria" },
    { value: "jordan", label: "Jordan" },
    { value: "lebanon", label: "Lebanon" },
    { value: "kuwait", label: "Kuwait" },
    { value: "qatar", label: "Qatar" },
    { value: "united-arab-emirates", label: "United Arab Emirates" },
    { value: "oman", label: "Oman" },
    { value: "bahrain", label: "Bahrain" },
    { value: "yemen", label: "Yemen" },
    { value: "afghanistan", label: "Afghanistan" },
    { value: "nepal", label: "Nepal" },
    { value: "sri-lanka", label: "Sri Lanka" },
    { value: "myanmar", label: "Myanmar" },
    { value: "kazakhstan", label: "Kazakhstan" },
    { value: "uzbekistan", label: "Uzbekistan" },
    { value: "turkmenistan", label: "Turkmenistan" },
    { value: "kyrgyzstan", label: "Kyrgyzstan" },
    { value: "tajikistan", label: "Tajikistan" },
    { value: "mongolia", label: "Mongolia" },
    { value: "north-korea", label: "North Korea" },
    { value: "bhutan", label: "Bhutan" },
    { value: "maldives", label: "Maldives" },
    { value: "brunei", label: "Brunei" },
    { value: "laos", label: "Laos" },
    { value: "cambodia", label: "Cambodia" },
    { value: "east-timor", label: "East Timor" },
    { value: "papua-new-guinea", label: "Papua New Guinea" },
    { value: "fiji", label: "Fiji" },
    { value: "solomon-islands", label: "Solomon Islands" },
    { value: "vanuatu", label: "Vanuatu" },
    { value: "samoa", label: "Samoa" },
    { value: "tonga", label: "Tonga" },
    { value: "micronesia", label: "Micronesia" },
    { value: "palau", label: "Palau" },
    { value: "marshall-islands", label: "Marshall Islands" },
    { value: "kiribati", label: "Kiribati" },
    { value: "nauru", label: "Nauru" },
    { value: "tuvalu", label: "Tuvalu" },
    { value: "seychelles", label: "Seychelles" },
    { value: "mauritius", label: "Mauritius" },
    { value: "comoros", label: "Comoros" },
    { value: "madagascar", label: "Madagascar" },
    { value: "mozambique", label: "Mozambique" },
    { value: "zimbabwe", label: "Zimbabwe" },
    { value: "zambia", label: "Zambia" },
    { value: "malawi", label: "Malawi" },
    { value: "angola", label: "Angola" },
    { value: "namibia", label: "Namibia" },
    { value: "botswana", label: "Botswana" },
    { value: "lesotho", label: "Lesotho" },
    { value: "swaziland", label: "Swaziland" },
    { value: "tanzania", label: "Tanzania" },
    { value: "uganda", label: "Uganda" },
    { value: "rwanda", label: "Rwanda" },
    { value: "burundi", label: "Burundi" },
    { value: "congo", label: "Congo" },
    { value: "democratic-republic-of-the-congo", label: "Democratic Republic of the Congo" },
    { value: "gabon", label: "Gabon" },
    { value: "equatorial-guinea", label: "Equatorial Guinea" },
    { value: "sao-tome-and-principe", label: "Sao Tome and Principe" },
    { value: "cameroon", label: "Cameroon" },
    { value: "central-african-republic", label: "Central African Republic" },
    { value: "chad", label: "Chad" },
    { value: "niger", label: "Niger" },
    { value: "mali", label: "Mali" },
    { value: "mauritania", label: "Mauritania" },
    { value: "senegal", label: "Senegal" },
    { value: "gambia", label: "Gambia" },
    { value: "guinea", label: "Guinea" },
    { value: "guinea-bissau", label: "Guinea-Bissau" },
    { value: "sierra-leone", label: "Sierra Leone" },
    { value: "liberia", label: "Liberia" },
    { value: "ivory-coast", label: "Ivory Coast" },
    { value: "burkina-faso", label: "Burkina Faso" },
    { value: "ghana", label: "Ghana" },
    { value: "togo", label: "Togo" },
    { value: "benin", label: "Benin" },
    { value: "sudan", label: "Sudan" },
    { value: "south-sudan", label: "South Sudan" },
    { value: "eritrea", label: "Eritrea" },
    { value: "djibouti", label: "Djibouti" },
    { value: "somalia", label: "Somalia" },
    { value: "equatorial-guinea", label: "Equatorial Guinea" },
  ];

  options.sort((a, b) => a.label.localeCompare(b.label));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff", // Background color of the control
      borderRadius: "5px",
      border: "1px solid #ccc",
      color: "#333",
      width: "auto",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#fff", // Background color of the dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#b3d9ff" : "#fff", // Background color of selected option and hover state
      color: "black",
      padding: 10,
    }),
  };
  // State to manage the selected option
  // const URL = process.env.REACT_APP_BACKEND_URL;
  const URL = `http://localhost:${process.env.PORT}`;
  const handleButtonClick = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      return false;
    }
   
    try {
      const response = await axios.post(`${URL}/auth/signup`, 
        {
          "email": email,
          "username": username,
          "password": password,
          "userRole": selectedRole,
          "mobileNumber": mobileNumber,
          "nationality": selectedNationality,
          "dateOfBirth": dob,
          "occupation": jobTitle,
        }
      );
      
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || 'Signup failed');
    }
    navigate("/login");
  };

  function isValid() {
    const nonNumericRegex = /\D/;
    if (
      
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      isValidEmail === false ||
      (selectedRole === "Tourist" &&
        (mobileNumber === "" || nonNumericRegex.test(mobileNumber) ||
          jobTitle === "" ||
          dob === "" ||
          selectedNationality === null))
    ) {
      return false;
    }
    if (password !== confirmPassword) {
      return false;
    }

    return true;
  }

  return (
    <div className="flex w-full items-center justify-center h-screen">
      <div>
        <p className="text-[rgba(88,87,87,0.822)] font-bold text-3xl">
          Signup now and get full access to our app.
        </p>
        <div className="flex justify-center">
          <form
            className="form w-full p-[10px] pt-[5px] flex flex-col gap-1.5 max-w-[350px] bg-white relative   outline-none border border-[rgba(105,105,105,0.397)] rounded-[10px]
       left-[10px] top-[15px] text-gray-500 text-[0.9em] cursor-text transition ease-linear duration-300"
          >
            <Toggle selectedRole={handleRoleChange} />

            <h6 className="text-sm font-medium text-gray-700">Username</h6>
            <label className="relative labelsignup">
              <input
                className="inputsignup"
                type="text"
                placeholder="Enter your username"
                onChange={handleUsernameChange}
                required
                value={username}
              />
            </label>

            <h6
              className={`text-sm font-medium text-gray-700 ${
                selectedRole !== "Tourist" ? "hidden" : ""
              }`}
            >
              Nationality
            </h6>

            <div
              className={`relative ${
                selectedRole !== "Tourist" ? "hidden" : ""
              }`}
            >
              <div style={{ width: "100%", margin: "auto" }} className="h-">
                <Select
                  className=""
                  options={options}
                  value={selectedNationality}
                  onChange={handleNationalityChange}
                  isSearchable={true} // Enable search functionality
                  placeholder="Select a country"
                  styles={customStyles} // Applying the custom styles
                  required
                />
              </div>
            </div>
            <h6 className="text-sm font-medium text-gray-700">Email</h6>

            <label className="relative labelsignup">
              <input
                className="inputsignup"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={handleEmailChange}
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
            </label>

            <h6
              className={`text-sm font-medium text-gray-700 ${
                selectedRole !== "Tourist" ? "hidden" : ""
              }`}
            >
              Mobile Number
            </h6>
            <label
              className={`relative labelsignup ${
                selectedRole !== "Tourist" ? "hidden" : ""
              }`}
            >
              <input
                className="inputsignup"
                type="tel"
                placeholder="Enter your mobile number"
                required
                value={mobileNumber}
                onChange={handleMobileNumberChange}
              />
            </label>
            <h6
              className={`text-sm font-medium text-gray-700 ${
                selectedRole !== "Tourist" ? "hidden" : ""
              }`}
            >
              Job Title
            </h6>

            <label
              className={`relative labelsignup ${
                selectedRole !== "Tourist" ? "hidden" : ""
              }`}
            >
              <input
                className="inputsignup"
                type="Job Title"
                placeholder="Enter your job title"
                required
                value={jobTitle}
                onChange={handleJobTitleChange}
              />
            </label>

            <div className={`relative labelsignup ${
                selectedRole !== "Tourist" ? "hidden" : ""
              }`}>
              <label
                className="block text-sm font-medium labelsignup text-gray-700"
                for="dob"
              >
                Date of Birth
              </label>
              <div className="mt-1">
                <input
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="date"
                  name="dob"
                  value={dob}
                  required
                  onChange={handleDobChange}
                />
              </div>
            </div>
            <h6 className="text-sm font-medium text-gray-700">Password</h6>

            <label className="relative labelsignup">
              <input
                className="inputsignup"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </label>

            <label className="relative labelsignup">
              <input
                className="inputsignup"
                type="password"
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {/* Role Change */}
            </label>
            {!passwordMatch && (
              <p className="text-red-500 text-xs">Passwords do not match</p>
            )}

            {passwordMatch && <p className="my-1.5"></p>}

            <button
              className="border-none mt-4 bg-[#02735f] outline-none bg-royalblue p-2.5 rounded-[10px] text-white text-[16px] transition-transform ease duration-300"
              onClick={handleButtonClick}
              type="submit"
            >
              Submit
            </button>
            <p className="text-[rgba(88,87,87,0.822)] text-sm text-center">
              Already have an account?
              <a className=" text-[#02735f] hover:underline" href="/login">
                {" "}
                Signin
              </a>
            </p>
            <p>{message}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;

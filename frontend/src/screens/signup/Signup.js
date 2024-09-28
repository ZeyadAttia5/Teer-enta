import React, { useState } from "react";
import "./signup.css";
import Select from "react-select";
import Toggle from "../../components/signup/Toggle.js";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
function Signup() {
  const navigate = useNavigate();

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

  const details = {
    username: username,
    email: email,
    nationality: selectedNationality,
    mobileNumber: mobileNumber,
    jobTitle: jobTitle,
    dob: dob,
    password: password,
    confirmPassword: confirmPassword,
    role: selectedRole,
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
    // Add more countries as needed
  ];
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

  const handleButtonClick = () => {
    if (isValid()) navigate("/login", { state: { userData: details } });
    return false;
  };

  function isValid() {
    const nonNumericRegex = /\D/;
    if (
      nonNumericRegex.test(mobileNumber) ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      isValidEmail === false ||
      (selectedRole === "Tourist" &&
        (mobileNumber === "" ||
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

            <div className="">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import unknownImage from "./unknown.jpg";
import axios from "axios";
import { FaExclamationCircle } from "react-icons/fa";
import SocialMediaIcons from "./SocialMediaIcons";
import AddPreviousWork from "./AddPreviousWork";
import PreviousWorksList from "./PreviousWorksList";

// async function getProfileData() {
//   try {
//     const response = await axios.get(`${URL}/profile/${id}`);

//     setMessage(response.data.message);
//   } catch (error) {
//     setMessage(error.response.data.message || 'Getting data failed');
//   }
// }

async function updateProfile(
  user,
  setUsername,
  setEmailInput,
  setEmail,
  setUserRole,
  setDob,
  setLinkInput,
  setHotlineInput,
  setCompanyProfileInput,
  setYearsOfExperienceInput,
  setDescriptionInput,
  setMessage,
  setNationalityInput,
  setWallet,
  setPreviousWorks,
  setNameInput,

  setJobTitleInput,
  setJobTitle,
  setMobileNumberInput,
  previousWorks
) {
  try {
    console.log("user id is: " + user._id);
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/profile/${user._id}`
    );
    const { data } = response;
    const tmpDate = new Date(data.dateOfBirth).toLocaleDateString("en-CA");

    switch (data.userRole) {
      case "Tourist":
        setUserRole("Tourist");
        setUsername(data.username);
        setMobileNumberInput(data.mobileNumber);

        setEmail(data.email);
        setEmailInput(data.email);
        setDob(tmpDate);
        setJobTitleInput(data.occupation);
        setJobTitle(data.occupation);
        setNameInput(data.name);

        setNationalityInput(data.nationality);
        setWallet(data.wallet);
        break;
      case "Advertiser":
        setUserRole("Advertiser");
        setUsername(data.username);
        setMobileNumberInput(data.hotline);

        setEmail(data.email);
        setEmailInput(data.email);
        setNameInput(data.name);

        setLinkInput(data.website);
        setHotlineInput(data.hotline);
        setCompanyProfileInput(data.companyProfile);
        break;
      case "TourGuide":
        setUserRole("TourGuide");
        setMobileNumberInput(data.mobileNumber);

        setUsername(data.username);
        setEmail(data.email);
        setEmailInput(data.email);
        setNameInput(data.name);

        setYearsOfExperienceInput(data.yearsOfExperience);
        setPreviousWorks(data.previousWorks);

        break;
      case "Seller":
        setUserRole("Seller");
        setUsername(data.username);
        console.log("Hey3 " + data.name);

        setNameInput(data.name);
        setEmail(data.email);
        setEmailInput(data.email);
        setMobileNumberInput(data.mobileNumber);

        setDescriptionInput(data.description);
        break;
      default:
        return false;
    }

    setMessage(response.data.message);
  } catch (error) {
    console.log("Hello 2");
    setMessage(error.response.data.message || "Updating profile failed");
  }
}

function Profile() {
  const location = useLocation();
  const { user, accessToken } = location.state || {}; // Destructure the user object passed
  const [addWork, setAddWork] = useState(false);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [mobileNumberInput, setMobileNumberInput] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState(jobTitle);
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [age, setAge] = useState("");
  const [wallet, setWallet] = useState("");
  const [complaints, setComplaints] = useState("");
  const [ageInput, setAgeInput] = useState(age);
  const [nationalityInput, setNationalityInput] = useState(nationality);
  const [emailInput, setEmailInput] = useState(email);
  const [linkInput, setLinkInput] = useState("");
  const [hotlineInput, setHotlineInput] = useState("");
  const [companyProfileInput, setCompanyProfileInput] =
    useState("Company Profile");
  const [yearsOfExperienceInput, setYearsOfExperienceInput] = useState("");
  const [previousWorkInput, setPreviousWorkInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [previousWorks, setPreviousWorks] = useState([]);
  const [updatedData, setUpdatedData] = useState({});

  const [nameInput, setNameInput] = useState("");

  if (username === "") {
    updateProfile(
      user,
      setUsername,
      setEmailInput,
      setEmail,
      setUserRole,
      setDob,
      setLinkInput,
      setHotlineInput,
      setCompanyProfileInput,
      setYearsOfExperienceInput,
      setDescriptionInput,
      setMessage,
      setNationalityInput,
      setWallet,
      setPreviousWorks,
      setNameInput,

      setJobTitleInput,
      setJobTitle,
      setMobileNumberInput,
      previousWorks
    );
    
  }

  

  const [isReadOnly, setIsReadOnly] = useState(true);
  const handleEdit = () => {
    setIsReadOnly(!isReadOnly);
  };

  const handleWallet = () => {
    // getWalletData();
  };

  const handleComplaint = () => {
    // getComplaintData();
  };

  const handleMobileNumberChange = (event) => {
    const value = event.target.value;
    const numericRegex = /^[0-9]*$/; // Regular expression to match only numeric characters

    if (numericRegex.test(value)) {
      setMobileNumberInput(value);
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmailInput(inputEmail);

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(inputEmail));
    if (isValidEmail) {
      setEmail(inputEmail);
    }
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setNameInput(e.target.value);
  };

  useEffect(() => {
    const updatedDataObj = {
      mobileNumber: mobileNumberInput,
      yearsOfExperience: yearsOfExperienceInput,
      previousWorks: previousWorks, // This will have the updated value
      email: emailInput,
    };

    setUpdatedData(updatedDataObj); // Now you have the updated data available
    console.log("Updated data: ", updatedDataObj);
  }, [previousWorks, mobileNumberInput, yearsOfExperienceInput, emailInput]);


  const handleUpdate = async (e) => {
    setIsReadOnly(true);

    if (!isValid()) return false;

    

    switch (userRole) {
      case "Tourist":
        console.log("hey1 " + dob);
        setUpdatedData({
          mobileNumber: mobileNumberInput,
          nationality: nationalityInput,
          userRole: userRole,
          email: emailInput,
          dateOfBirth: dob,
          occupation: jobTitle,
        });

        break;
      case "Advertiser":
        setUpdatedData({
          website: linkInput,
          hotline: mobileNumberInput,
          companyProfile: companyProfileInput,
          email: emailInput,
        });

        break;
      case "TourGuide":
        

        break;
      case "Seller":
        setUpdatedData({
          mobileNumber: mobileNumberInput,
          email: emailInput,
          description: descriptionInput,
          name: nameInput,
        });
        break;
      default:
        return false;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/profile/update/${user._id}`,
        updatedData
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Updating profile failed");
    }

    setAge(ageInput);
    setNationality(nationalityInput);
    setEmail(emailInput);

    console.log("email is: " + email);
    // navigate("/profile", { state: { userData: details } });
  };

  function isValid() {
    return isValidEmail;
  }

  const handleAddWork = () => {
    setAddWork(true);
  };

  const cancelWork = () => {
    setAddWork(false);
  };

  const onAddWork = (work) => {
    setPreviousWorks((prevWorks) => {
      const updatedWorks = [...prevWorks, work];

      // Log the updated state here
      updatedWorks.forEach((work, index) => {
        console.log(`Work ${index}: ${work.jobTitle}`);
      });

      return updatedWorks;
    });
    setAddWork(false);
    handleUpdate();
  };

  const handleJobTitleChange = (e) => {
    setJobTitleInput(e.target.value);
    setJobTitle(e.target.value);
  };
  const handleNationalityChange = (e) => {
    setNationalityInput(e.target.value);
  };

  return (
    <div className="flex justify-center">
      <div className="flex m-16 gap-16">
        <div className="flex flex-col">
          <div className="border-2 border-[#02735f]">
            <div className="border-2 border-white">
              <img
                width={200}
                src={unknownImage}
                alt={`user's profile`}
                className="border-2 border-[#02735f]"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4 mt-4"></div>
          <div className="flex flex-col space-y-4 mt-4">
            <button
              className="flex gap-2 items-center justify-center px-4 py-2 bg-[#02735f] text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              onClick={handleEdit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit Profile
            </button>

            <button
              className="flex gap-2 items-center justify-center px-4 py-2 bg-[#02735f] text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              onClick={handleComplaint}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
              Complaint
            </button>
          </div>
        </div>
        <div className="flex-col flex gap-32">
          <div>
            <h6 className="text-5xl font-medium text-[#02735f]">{username}</h6>
            <p className="text-lg font-semibold text-[#02735f]">
              {userRole === "TourGuide" ? "Tour Guide" : userRole}
            </p>
          </div>
          <div>
            {userRole === "Tourist" && (
              <div className="flex gap-8">
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-[#02735f]">Name</span>
                    <input
                      type="text"
                      value={username}
                      readOnly
                      placeholder={!isReadOnly ? "Enter your name" : ""}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                  <div>
                    <span className="text-2xl text-[#02735f]">Phone</span>
                    <input
                      type="text"
                      value={mobileNumberInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      onChange={handleMobileNumberChange}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-[#02735f]">Job Title</span>
                    <input
                      type="text"
                      value={jobTitleInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      onChange={handleJobTitleChange}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                  <div>
                    <span className="text-2xl text-[#02735f]">Nationality</span>
                    <input
                      type="text"
                      value={nationalityInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      onChange={handleNationalityChange}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div className="relative">
                    <span className="text-2xl text-[#02735f]">Email</span>
                    <input
                      className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                      type="email"
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      required
                      value={emailInput}
                      readOnly={isReadOnly}
                      onChange={handleEmailChange}
                    />
                    {!isValidEmail && (
                      <FaExclamationCircle
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(40%)",
                          color: "red",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl text-[#02735f]">
                      Date of Birth
                    </span>
                    <input
                      type="text"
                      value={dob}
                      readOnly
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-[#02735f]">Wallet</span>
                    <input
                      type="text"
                      value={wallet}
                      readOnly
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>
              </div>
            )}
            {userRole === "Advertiser" && (
              <div className="flex gap-8">
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-[#02735f]">Name</span>
                    <input
                      type="text"
                      value={username}
                      readOnly
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                  <div>
                    <span className="text-2xl text-[#02735f]">Hotline</span>
                    <input
                      type="text"
                      value={mobileNumberInput}
                      placeholder={!isReadOnly ? "Enter your hotline" : ""}
                      readOnly={isReadOnly}
                      onChange={handleMobileNumberChange}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-[#02735f]">
                      Website Link
                    </span>
                    <input
                      type="text"
                      value={linkInput}
                      placeholder={!isReadOnly ? "Enter your website link" : ""}
                      readOnly={isReadOnly}
                      onChange={(e) => setLinkInput(e.target.value)}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                  <div className="relative">
                    <span className="text-2xl text-[#02735f]">Email</span>
                    <input
                      className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                      type="email"
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      required
                      value={emailInput}
                      readOnly={isReadOnly}
                      onChange={handleEmailChange}
                    />
                    {!isValidEmail && (
                      <FaExclamationCircle
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(40%)",
                          color: "red",
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-[#02735f]">
                      Company Profile
                    </span>
                    <input
                      type="text"
                      value={companyProfileInput}
                      placeholder={
                        !isReadOnly ? "Enter your company profile" : ""
                      }
                      readOnly={isReadOnly}
                      onChange={(e) => setCompanyProfileInput(e.target.value)}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>
              </div>
            )}
            {userRole === "TourGuide" && (
              <div>
                <div className="flex gap-8">
                  <div className="flex flex-col gap-8">
                    <div>
                      <span className="text-2xl text-[#02735f]">Name</span>
                      <input
                        type="text"
                        value={username}
                        readOnly
                        className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                      />
                    </div>
                    <div>
                      <span className="text-2xl text-[#02735f]">Phone</span>
                      <input
                        type="text"
                        value={mobileNumberInput}
                        readOnly={isReadOnly}
                        placeholder={
                          !isReadOnly ? "Enter your phone number" : ""
                        }
                        onChange={handleMobileNumberChange}
                        className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div>
                      <span className="text-2xl text-[#02735f]">
                        Years of Experience
                      </span>
                      <input
                        type="text"
                        value={yearsOfExperienceInput}
                        readOnly={isReadOnly}
                        placeholder={
                          !isReadOnly ? "Enter your years of experience" : ""
                        }
                        onChange={(e) =>
                          setYearsOfExperienceInput(e.target.value)
                        }
                        className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                      />
                    </div>

                    <div className="flex flex-col gap-8">
                      <div className="relative">
                        <span className="text-2xl text-[#02735f]">Email</span>
                        <input
                          className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                          type="email"
                          placeholder={!isReadOnly ? "Enter your email" : ""}
                          required
                          value={emailInput}
                          readOnly={isReadOnly}
                          onChange={handleEmailChange}
                        />
                        {!isValidEmail && (
                          <FaExclamationCircle
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(40%)",
                              color: "red",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <PreviousWorksList previousWorks={previousWorks} />
                </div>
                {addWork === true && (
                  <AddPreviousWork
                    onAddWork={onAddWork}
                    cancelWork={cancelWork}
                  />
                )}
                <div className="mt-8">
                  <button
                    className="flex gap-2 items-center justify-center px-4 py-2 text-[#02735f] rounded-lg shadow-md hover:bg-[#02735f] focus:ring-0 hover:text-white transition duration-300"
                    onClick={handleAddWork}
                  >
                    <span className="font-bold">+</span> Add Work
                  </button>
                </div>
              </div>
            )}
            {userRole === "Seller" && (
              <div className="flex gap-8">
                <div className="flex flex-col gap-8">
                  <div>
                    <span className="text-2xl text-[#02735f]">Name</span>
                    <input
                      type="text"
                      value={nameInput}
                      readOnly={isReadOnly}
                      onChange={handleNameChange}
                      placeholder={!isReadOnly ? "Enter your name" : ""}
                      className="border-2 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                  <div>
                    <span className="text-2xl text-[#02735f]">Phone</span>
                    <input
                      type="text"
                      placeholder={!isReadOnly ? "Enter your phone number" : ""}
                      value={mobileNumberInput}
                      readOnly={isReadOnly}
                      onChange={handleMobileNumberChange}
                      className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="relative">
                    <span className="text-2xl text-[#02735f]">Email</span>
                    <input
                      className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                      type="email"
                      placeholder={!isReadOnly ? "Enter your email" : ""}
                      required
                      value={emailInput}
                      readOnly={isReadOnly}
                      onChange={handleEmailChange}
                    />
                    {!isValidEmail && (
                      <FaExclamationCircle
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(40%)",
                          color: "red",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <span className="text-2xl text-[#02735f]">Description</span>
                    <input
                      type="text"
                      value={descriptionInput}
                      readOnly={isReadOnly}
                      placeholder={!isReadOnly ? "Enter your description" : ""}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      className="border-2 focus:ring-0 block border-[#02735f] bg-gray-300 p-3"
                    />
                  </div>
                </div>
              </div>
            )}
            {!isReadOnly && (
              <div className="mt-8">
                <button
                  className="flex gap-2 items-center justify-center px-4 py-2 text-[#02735f] rounded-lg shadow-md hover:bg-[#02735f] focus:ring-0 hover:text-white transition duration-300"
                  onClick={handleUpdate}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
          {/* <SocialMediaIcons facbook={facebook} instagram={instagram} twitter={twitter} linkedin={linkedin}/> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;

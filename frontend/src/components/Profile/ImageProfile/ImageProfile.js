import React, { useEffect, useState, useRef } from "react";
import "./ImageProfile.css";
import unknownImage from "../unknown.jpg";
import { updateProfilee } from "../../../api/profile.ts";
function Card() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [isHovered, setIsHovered] = useState(false);
  const [srcImage, setSrcImage] = useState(null);
  const fileInputRef = useRef(null); // Create a reference for the file input
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (
      user &&
      (user.userRole === "Advertiser" || user.userRole === "Seller") &&
      user.logoUrl &&
      srcImage !== user.logoUrl
    ) {
      setSrcImage(user.logoUrl);
    } else if (
      user &&
      user.userRole === "TourGuide" &&
      user.photoUrl &&
      srcImage !== user.photoUrl
    ) {
      setSrcImage(user.photoUrl);
    }
  }, [user, srcImage]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setSelectedFile(file); // Update state with the selected file
      handleUpload(file); // Call the handleUpload function
    }
  };

  const handleChangePhoto = () => {
    fileInputRef.current.click();
    console.log("Change photo");
  };

  const handleUpload = async (file) => {
    // Implement your upload logic here
    const formData = new FormData();
    var x;
    if (
      user &&
      (user.userRole === "Advertiser" || user.userRole === "Seller")
    ) {
      x = "logoUrl";
    } else if (user && user.userRole === "TourGuide") {
      x = "photoUrl";
    }
    console.log("file is " + file);
    formData.append(x, file);
   
    try {
      
      const response = await updateProfilee(formData, user._id);
      localStorage.setItem("user", JSON.stringify(response.data.updatedProfile));
      setSrcImage(response.data.updatedProfile[x]);
      console.log("updated 1");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="card">
      <div
        className="card-header relative"
        onMouseEnter={() => setIsHovered(true)} // Set hovered state to true on mouse enter
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative ">
          <img
            src={srcImage}
            alt="../unknown.jpg"
            className="profile-image cursor-pointer absolute left-0 right-0 bottom-0 top-0 m-auto"
            style={{ height: "200px", width: "200px" }}
          />
          {!srcImage && (
          <img
            src={unknownImage}
            alt="../unknown.jpg"
            className="profile-image cursor-pointer absolute left-0 right-0 bottom-0 top-0 m-auto"
            style={{ height: "200px", width: "200px" }}
          />)}
          {isHovered && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the input
                onChange={handleFileSelect}
              />
              <button
                className="absolute inset-0 flex justify-center items-center opacity-100 top-48 transition-opacity bg-black bg-opacity-100 rounded-full"
                type="button"
                style={{
                  color: "white",
                  fontSize: "16px",

                  zIndex: 1, // Ensure the button is above the image
                }}
                onClick={handleChangePhoto}
                aria-label="Edit Profile Picture"
              >
                change photo
              </button>
            </div>
          )}
        </div>
        <div className="card-header-slanted-edge"></div>
      </div>

      <div className="card-body">
        <span className="name">{user.name ?? user.username}</span>
        <br />
        <span className="job-title">
          <u>{user.userRole === "TourGuide" ? "Tour Guide" : user.userRole}</u>
        </span>

        <div className="social-accounts">{/* Social media icons */}</div>
      </div>

      <div className="card-footer">
        <div className="stats">
          <div className="stat">
            <span className="label">Following</span>
            <span className="value">56K</span>
          </div>
          <div className="stat">
            <span className="label">Followers</span>
            <span className="value">940</span>
          </div>
          <div className="stat">
            <span className="label">Likes</span>
            <span className="value">320</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

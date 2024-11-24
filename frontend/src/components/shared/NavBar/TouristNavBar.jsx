import { CalendarOutlined, MenuOutlined } from "@ant-design/icons";
import AccountButton from "./AccountButton";
import useMediaQuery from "use-media-antd-query";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Importing a logout icon from react-icons
import logo from "../../../assets/logo/logo2.jpg";
import ConfirmationModal from "../ConfirmationModal";
import { on } from "events";
import { set } from "date-fns";
import NotificationIcon from "./notificationIcon";

const SideBar = ({ children, classNames }) => {
  const size = useMediaQuery();
  const [open, setOpen] = useState(false);

  if (["xs", "sm", "md"].includes(size)) {
    return (
      <div>
        <MenuOutlined onClick={() => setOpen(true)} />
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          classNames={classNames}
        >
          {children}
        </Drawer>
      </div>
    );
  }
  return children;
};

const TouristNavBar = ({ setModalOpen, isNavigate, setIsNavigate }) => {
  const navigate = useNavigate();
  const size = useMediaQuery();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const onAccountClick = () => {
    if (
      user &&
      (user.userRole === "Admin" || user.userRole === "TourismGovernor")
    ) {
      navigate("/changePassword");
    } else if (user && user.userRole === "Tourist") {
      navigate("/newProfile");
    } else {
      navigate(user ? "/profile" : "/login");
    }
  };

  useEffect(() => {
    if (isNavigate) {
      navigate("/");
      setIsNavigate(false);
    }
  }, [isNavigate]);

  const navbarColor = window.location.pathname === "/" ? "first" : "fourth";

  return (
    <div
      className={`w-full flex justify-between items-center bg-${navbarColor} shadow-md to-teal-700%  p-6 z-50 h-20 text-white font-bold space-x-8`} // Changed z-10 to z-50
    >
      {/* Logo Section */}
      <span className="ml-16 text-lg leading-7">
        <div className="cursor-pointer w-fit border border-transparent  p-2 rounded-md transition-all duration-300 hover:scale-105">
          {/* Logo Link */}
          <Link to={"/"} className="ring-0">
            <img
              src={logo}
              alt="Logo"
              width={80}
              className="rounded-full shadow-lg hover:rotate-6 transition-all duration-500"
            />
          </Link>
        </div>
      </span>

      {/* Navigation Links */}
      <div className="flex flex-row gap-10 items-center">
        {["Equipment", "About Us", "Blog"].map((item, index) => (
          <Link
            key={index}
            className={`text-lg leading-5 cursor-pointer relative group hover:text-yellow-${
              navbarColor === "first" ? 500 : 500
            } transition duration-300 ease-in-out text-${
              navbarColor === "first" ? "fourth" : "first"
            }`}
            to={item === "About Us" ? "/aboutUs" : ``}
          >
            {item}
            {/* Fancy Underline Animation */}
            <span
              className={`absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-${
                navbarColor === "first" ? 500 : 500
              } hover:text-yellow-${
                navbarColor === "first" ? 300 : 700
              } transition-all duration-300 group-hover:w-full`}
            ></span>
          </Link>
        ))}
      </div>

      {!["xs", "sm", "md"].includes(size) && (
        <div className="flex items-center gap-5">
          {user && user.userRole === "Tourist" && (
            <>
              <div
                onClick={() => navigate("/Bookings")}
                className={`flex items-center justify-center p-2  bg-${navbarColor} mt-3 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-${
                  navbarColor === "fourth" ? "third" : "second"
                } hover:text-yellow-500 cursor-pointer`}
              >
                <CalendarOutlined
                  className={`text-${
                    navbarColor === "first" ? "fourth" : "first"
                  } text-2xl transition-colors `}
                />
              </div>
              <div
                className={`flex items-center justify-center p-2  bg-${navbarColor} mt-3 rounded-full shadow-md transition-transform transform hover:scale-110 z-50 hover:bg-${
                  navbarColor === "fourth" ? "third" : "second"
                } hover:text-yellow-500 cursor-pointer`}
              >
                <NotificationIcon
                  navbarColor={navbarColor}
                  onClick={() => (window.location.href = "/NotificationsPage")}
                />
              </div>
            </>
          )}

          <div className="flex justify-end items-center lg:flex-1 mt-4">
            <AccountButton
              extra_tw={`bg-${navbarColor} hover:bg-${
                navbarColor === "fourth" ? "third" : "second"
              } transition text-${
                navbarColor === "first" ? "fourth" : "first"
              } duration-300 p-2 rounded-lg flex items-center justify-center transform hover:scale-110`}
              onClick={onAccountClick}
            />
          </div>

          {user && (
            <button
              onClick={() => setModalOpen(true)}
              className={`flex items-center text-${
                navbarColor === "first" ? "fourth" : "first"
              } hover:text-${"white"} justify-center mt-4 p-2 bg-${navbarColor} hover:bg-red-700 rounded-full transition duration-300 shadow-lg transform hover:scale-110 focus:outline-none`}
              aria-label="Logout"
            >
              <FiLogOut className={`w-6 h-6`} />
            </button>
          )}
        </div>
      )}
      {["xs", "sm", "md"].includes(size) && (
        <SideBar
          classNames={{
            body: "bg-fourth text-white flex flex-col items-center p-4 rounded-lg shadow-lg",
            header: "bg-fourth text-white font-bold text-lg p-4",
          }}
        >
          <div className="flex justify-end items-center lg:flex-1 mt-4">
            <AccountButton
              extra_tw="bg-fourth text-first hover:bg-second transition duration-300 p-2 rounded-lg shadow-lg flex items-center justify-center transform hover:scale-110"
              onClick={onAccountClick}
            />
          </div>

          {user && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center text-first hover:text-white justify-center mt-4 p-2 bg-fourth hover:bg-red-700 rounded-full transition duration-300 shadow-lg transform hover:scale-110 focus:outline-none"
              aria-label="Logout"
            >
              <FiLogOut className="w-6 h-6" />
            </button>
          )}
        </SideBar>
      )}
    </div>
  );
};

export default TouristNavBar;

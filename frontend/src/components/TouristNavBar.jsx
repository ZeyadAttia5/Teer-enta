import { MenuOutlined } from "@ant-design/icons";
import AccountButton from "./AccountButton";
import useMediaQuery from "use-media-antd-query";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Importing a logout icon from react-icons
import logo from "../assets/logo/logo.jpeg";
import ConfirmationModal from "./ConfirmationModal";
import { on } from "events";
import { set } from "date-fns";

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

const TouristNavBar = ({setModalOpen, isNavigate, setIsNavigate}) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  const onAccountClick = () => {
    if(user && (user.userRole === "Admin" || user.userRole === "TourismGovernor")){
      return false;
    }
    navigate(user ? "/profile" : "/login");
  };

  useEffect(() => {
    if (isNavigate) {
      navigate("/");
      setIsNavigate(false);
    }
  }
  , [isNavigate]);

  return (
    <div className="w-full flex flex-row text-white justify-between font-bold h-16 p-12 z-10 items-center">
      <span className="font-bold flex-1 ml-8 text-lg leading-7 justify-start ">
        <div className="">
          <div className="cursor-pointer w-fit  border border-transparent hover:border-white p-2 rounded-md transition-all duration-300">
            <Link to={"/"} className="ring-0">
              <img src={logo} alt="Logo" width={120} className=" rounded-lg"/>
            </Link>
          </div>
        </div>
      </span>

      <SideBar
        classNames={{
          body: "bg-[#075B4C] text-white flex flex-col",
          header: "bg-[#075B4C]",
        }}
      >
        <div className="gap-10 lg:flex-[0.5] flex-col items-end lg:items-center lg:flex-row flex justify-between">
          {["Equipment", "About Us", "Blog"].map((item, index) => (
            <span
              key={index}
              className="text-lg leading-5 cursor-pointer after:content-[''] after:border-transparent after:border   hover:after:border-white after:flex after:w-0 after:hover:w-full after:transition-all after:duration-300"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="justify-end lg:flex-1 mt-2 mr-4">
          <AccountButton
            extra_tw={"justify-end lg:flex-1 mt-2"}
            onClick={onAccountClick}
          />
        </div>
        {user && (
        <button
          onClick={() => setModalOpen(true)}
          className="flex mt-2 items-center justify-center p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none transition duration-300 ease-in-out"
          aria-label="Logout"
        >
          <FiLogOut className="w-5 h-5" />
        </button>
        )}
        
      </SideBar>
    </div>
  );
};

export default TouristNavBar;

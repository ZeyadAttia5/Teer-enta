import {
  CalendarOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import AccountButton from "./AccountButton";
import useMediaQuery from "use-media-antd-query";
import { Drawer, Badge } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import logo from "../../../assets/logo/logo2.jpg";
import ConfirmationModal from "../ConfirmationModal";
import { on } from "events";
import { set } from "date-fns";
import NotificationIcon from "./notificationIcon";
import { getCart } from "../../../api/cart.ts";
import SearchHome from "../HomePage/SearchHome.js";

const SideBar = ({ children, classNames }) => {
  const size = useMediaQuery();
  const [open, setOpen] = useState(false);

  if (["xs", "sm", "md"].includes(size)) {
    return (
      <div>
        <MenuOutlined onClick={() => setOpen(true)} className={`text-first`} />
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
  const [cartCount, setCartCount] = useState(0);
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
    const fetchCartCount = async () => {
      try {
        const response = await getCart(); // Replace with your actual API endpoint
        setCartCount(response.data.cart.length);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    if (user && user.userRole === "Tourist") {
      fetchCartCount();
    }
  }, [isNavigate, user]);

  return (
    <div
      className={`w-full fixed bg-white flex justify-around items-center to-teal-700%  p-6 z-10 h-20 text-white font-bold space-x-8`}
    >
      <div className="flex gap-8">
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

        {/* Search Bar */}
        <SearchHome />
      </div>

      {!["xs", "sm", "md"].includes(size) && (
        <div className="flex items-center gap-5">
          {user && user.userRole === "Tourist" && (
            <>
              {/* Bookings Icon */}
              <div
                onClick={() => navigate("/Bookings")}
                className=" text-first hover:border-b-2 px-2 pt-2 mt-2 hover:border-first transition-all duration-300 transform cursor-pointer"
              >
                <CalendarOutlined
                  className={`text-fifth text-2xl transition-colors block`}
                />
                <span className="text-fifth text-sm">Calender</span>
              </div>

              {/* Cart Icon */}
              {user && user.userRole === "Tourist" && (
                <div
                  onClick={() => navigate("/products/cart")}
                  className=" text-first hover:border-b-2 px-2 pt-2 mt-2 hover:border-first transition-all duration-300 transform cursor-pointer"
                >
                  <Badge
                    count={cartCount}
                    offset={[9, -5]}
                    color={"red"}
                    className="block"
                  >
                    <ShoppingCartOutlined
                      className={`text-fifth text-2xl transition-colors`}
                    />
                  </Badge>
                  <span className="text-fifth text-sm">Cart</span>
                </div>
              )}
            </>
          )}

          {/* Notifications Icon */}
          {user &&
            (user.userRole === "Tourist" ||
              user.userRole === "Advertiser" ||
              user.userRole === "TourGuide") && (
              <div className=" text-first hover:border-b-2 px-2 pt-2 mt-2 hover:border-first transition-all duration-300 transform cursor-pointer">
                <div className="flex justify-center">
                  <NotificationIcon
                    className={`text-fifth text-2xl transition-colors`}
                  />
                </div>
                <span className="text-fifth text-sm">Notifications</span>
              </div>
            )}

          {/* Account and Logout Buttons */}
          <div className="flex justify-end items-center lg:flex-1 mt-2">
            <AccountButton
              extra_tw={` transition duration-300 px-2 pt-2 transform`}
              onClick={onAccountClick}
              setModalOpen={setModalOpen}
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {["xs", "sm", "md"].includes(size) && (
        <SideBar
          classNames={{
            body: "bg-fourth text-white flex flex-col items-center p-4 rounded-lg shadow-lg",
            header: "bg-fourth text-white font-bold text-lg p-4",
          }}
        >
          {user && user.userRole === "Tourist" && (
            <div className="flex flex-col gap-4 w-full items-center mb-4">
              {/* Mobile Bookings Icon */}
              <div
                onClick={() => navigate("/Bookings")}
                className="flex items-center justify-center p-2 bg-fourth text-first hover:bg-second rounded-full shadow-md transition-all duration-300 transform hover:scale-110 cursor-pointer w-12 h-12"
              >
                <CalendarOutlined className="text-2xl" />
              </div>
              {/* Mobile Cart Icon */}
              <div
                onClick={() => navigate("/products/cart")}
                className="flex items-center justify-center p-2 bg-fourth text-first hover:bg-second rounded-full shadow-md transition-all duration-300 transform hover:scale-110 cursor-pointer w-12 h-12"
              >
                <Badge count={cartCount} offset={[-5, 5]}>
                  <ShoppingCartOutlined className="text-2xl" />
                </Badge>
              </div>
              {/* Mobile Notifications Icon */}
              <div className=" text-first hover:border-b-2 hover:border-first shadow-md transition-all duration-300 transform hover:scale-110 cursor-pointer w-12 h-12">
                <NotificationIcon />
                <span className="text-black">Notifications</span>
              </div>
            </div>
          )}

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

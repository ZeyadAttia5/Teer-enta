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
import logo from "../../../assets/logo/logo2.png";
import NotificationIcon from "./notificationIcon";
import { getCart } from "../../../api/cart.ts";
import { getCurrency } from "../../../api/account.ts";
import PromoCodeStrip from "../../PromoCodeAdmin/PromoCodeStrip.jsx";

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

const TouristNavBar = ({ setModalOpen, isNavigate, setIsNavigate, setVisibleFlagHome }) => {
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

  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await getCurrency();
        setCurrency(response?.data);
        // console.log("Currency:", response.data);
      } catch (error) {
        console.error("Fetch currency error:", error);
      }
    };
    fetchCurrency();
  }, []);

  useEffect(() => {
    if (isNavigate) {
      navigate("/");
      setIsNavigate(false);
    }
    const fetchCartCount = async () => {
      try {
        const response = await getCart(); // Replace with your actual API endpoint
        setCartCount(response?.data.cart.length);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    if (user && user.userRole === "Tourist") {
      fetchCartCount();
    }
  }, [isNavigate, user]);
  const [visible, setVisible] = useState(true);
  return (
    <div className="fixed w-full">
      {(!user || (user && user.userRole === "Tourist")) && (
        <PromoCodeStrip setVisibleFlag={setVisible} setVisibleFlagHome={setVisibleFlagHome}/>
      )}
      <div
        className={`w-full fixed ${(visible && (!user || (user && user.userRole === "Tourist"))) ? "top-9" : "top-0"} bg-white flex justify-between shadow-md  items-center to-teal-700%  p-6 h-20 text-white font-bold space-x-8`}
      >
        <div className="flex gap-4 ml-8">
          {/* Logo Section */}
          <span className="ml-16 text-lg leading-7">
            <div className="cursor-pointer w-fit border border-transparent  p-2 rounded-md transition-all duration-300 ">
              {/* Logo Link */}
              <Link to={(user === null) || (user && user.userRole === "Tourist") ? "/" : "/reports"} className="ring-0">
                <img
                  src={logo}
                  alt="Logo"
                  width={80}
                  className="rounded-full  hover:rotate-6 transition-all duration-500"
                />
              </Link>
            </div>
          </span>
          <span className="text-first flex text-4xl justify-center items-center italic">
            TEER ENTA
          </span>
          {/* Search Bar */}
        </div>

        {!["xs", "sm", "md"].includes(size) && (
          <div className="flex items-center gap-5">
            {user && user.userRole === "Tourist" && (
              <>
                {/* Bookings Icon */}
                <div
                  onClick={() => navigate("/newProfile")}
                  className=" text-first hover:border-b-2 px-2 pt-2 mt-2 hover:border-first transition-all duration-300 transform cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="gray"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                    />
                  </svg>

                  <span className="text-fifth text-sm">{currency?.code}</span>
                </div>

                <div
                  onClick={() => navigate("/Bookings")}
                  className=" text-first hover:border-b-2 px-2 pt-2 hover:border-first transition-all duration-300 transform cursor-pointer"
                >
                  <CalendarOutlined
                    className={`text-fifth text-2xl transition-colors block`}
                  />
                  <span className="text-fifth text-sm">Bookings</span>
                </div>

                {/* Cart Icon */}
                {user && user.userRole === "Tourist" && (
                  <div
                    onClick={() => navigate("/products/cart")}
                    className=" text-first hover:border-b-2 px-2 pt-2 mt-1 hover:border-first transition-all duration-300 transform cursor-pointer"
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
                  user.userRole === "Seller" ||
                user.userRole === "TourGuide") && (
                    <div
                        className="flex-row text-first hover:border-b-2 px-2 hover:border-first transition-all duration-300 transform cursor-pointer">
                      <div className="flex justify-center mt-3">
                        <NotificationIcon className="text-fifth text-2xl transition-colors"/>
                      </div>
                    </div>
                )}

            {/* Account and Logout Buttons */}
            <div className="flex justify-end items-center lg:flex-1 mt-2  mr-16">
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
                        className="flex items-center justify-center p-2 bg-fourth text-first  rounded-full shadow-md transition-all duration-300 transform  cursor-pointer w-12 h-12"
                    >
                      <CalendarOutlined className="text-2xl"/>
                    </div>
                    {/* Mobile Cart Icon */}
                    <div
                        onClick={() => navigate("/products/cart")}
                        className="flex items-center justify-center p-2 bg-fourth text-first  rounded-full shadow-md transition-all duration-300 transform  cursor-pointer w-12 h-12"
                    >
                      <Badge count={cartCount} offset={[-5, 5]}>
                        <ShoppingCartOutlined className="text-2xl"/>
                      </Badge>
                    </div>
                    {/* Mobile Notifications Icon */}
                    <div
                        className="flex items-center justify-center p-2 bg-fourth text-first rounded-full shadow-md transition-all duration-300 transform  cursor-pointer w-12 h-12">
                      <NotificationIcon/>
                    </div>
                  </div>
              )}

              <div className="flex justify-end items-center lg:flex-1 mt-2  mr-16">
                <AccountButton
                    extra_tw={` transition duration-300 px-2 pt-2 transform`}
                    onClick={onAccountClick}
                    setModalOpen={setModalOpen}
                />
              </div>
            </SideBar>
        )}
      </div>
    </div>
  );
};

export default TouristNavBar;

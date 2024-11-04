// DrawerMenu.js
import React from "react";
import { Drawer, Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ visible, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  const handleClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer
      title="Menu"
      placement="left"
      closable={true}
      onClose={onClose}
      visible={visible}
    >
      <Menu mode="inline" defaultSelectedKeys={[]} className="">
        {user &&
          (user.userRole === "Admin" ||
            user.userRole === "TourismGovernor") && (
            <Menu.SubMenu key="sub5" title="Tags">
              {user && user.userRole === "Admin" && (
                <Menu.Item
                  key="1"
                  onClick={() => handleClick("/preference-tags")}
                >
                  Preference Tags
                </Menu.Item>
              )}
              {user &&
                (user.userRole === "Admin" ||
                  user.userRole === "TourismGovernor") && (
                  <Menu.Item key="2" onClick={() => handleClick("/tags")}>
                    Tags
                  </Menu.Item>
                )}
            </Menu.SubMenu>
          )}
        {(user === null ||
          (user &&
            (user.userRole === "TourismGovernor" ||
              user.userRole === "Tourist" ||
              user.userRole === "Admin"))) && (
          <Menu.SubMenu key="sub4" title="Historical Places">
            <Menu.Item key="3" onClick={() => handleClick("/historicalPlace")}>
              Historical Places
            </Menu.Item>
            {user && user.userRole === "TourismGovernor" && (
              <Menu.Item
                key="12"
                onClick={() => handleClick("/historicalPlace/my")}
              >
                My Historical Places
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}
        {(user === null ||
          (user &&
            (user.userRole === "TourGuide" ||
              user.userRole === "Tourist" ||
              user.userRole === "Admin"))) && (
          <Menu.SubMenu key="sub1" title="Itinerary">
            <Menu.Item key="4" onClick={() => handleClick("/itinerary")}>
              Itinerary
            </Menu.Item>
            <Menu.Item
              key="15"
              onClick={() => handleClick("/itinerary/flaggedIternaries")}
            >
              Flagged Itinerary
            </Menu.Item>
            {user && user.userRole === "TourGuide" && (
              <Menu.Item key="5" onClick={() => handleClick("/itinerary/my")}>
                My Itinerary
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}
        {user &&
          user &&
          (user.userRole === "Advertiser" || user.userRole === "Admin") && (
            <Menu.SubMenu key="sub3" title="Activities">
              {user && user.userRole === "Admin" && (
                <Menu.Item
                  key="6"
                  onClick={() => handleClick("/activity-categories")}
                >
                  Activity Categories
                </Menu.Item>
              )}
              {user && user.userRole === "Admin" && (
                <Menu.Item
                  key="16"
                  onClick={() => handleClick("/flaggedActivities")}
                >
                  Flagged Activity
                </Menu.Item>
              )}
              <Menu.Item key="7" onClick={() => handleClick("/activities")}>
                Activities
              </Menu.Item>
              {user && user.userRole === "Advertiser" && (
                <Menu.Item
                  key="8"
                  onClick={() => handleClick("/activities/my")}
                >
                  My Activities
                </Menu.Item>
              )}
            </Menu.SubMenu>
          )}
        {(user === null || (user && user.userRole === "Tourist")) && (
          <Menu.SubMenu key="sub10" title="Activities">
            <Menu.Item
              key="20"
              onClick={() => handleClick("/touristActivities")}
            >
              Activities
            </Menu.Item>
          </Menu.SubMenu>
        )}
        {(user === null ||
          (user &&
            (user.userRole === "Seller" ||
              user.userRole === "Tourist" ||
              user.userRole === "Admin"))) && (
          <Menu.SubMenu key="sub6" title="Products">
            <Menu.Item key="13" onClick={() => handleClick("/products")}>
              All Products
            </Menu.Item>
            {user &&
              (user.userRole === "Seller" || user.userRole === "Admin") && (
                <Menu.Item
                  key="14"
                  onClick={() => handleClick("/products/create")}
                >
                  Add Product
                </Menu.Item>
              )}
            </Menu.SubMenu>
          )}
        {(user && (user.userRole === "Tourist" || user.userRole === "Admin")) && (
          <Menu.SubMenu key="sub7" title="Complaints">
            {user && user.userRole === "Admin" && (
              <Menu.Item key="17" onClick={() => handleClick("/ComplaintsManagement")}>
                Complaints Management
              </Menu.Item>
            )}
            {user && user.userRole === "Tourist" && (
              <Menu.Item key="18" onClick={() => handleClick("/myComplaints")}>
                My Complaints
              </Menu.Item>
            )}
          </Menu.SubMenu>
        )}
        {user && user.userRole === "Admin" && (
          <Menu.SubMenu key="sub2" title="Users">
            <Menu.Item key="9" onClick={() => handleClick("/allUsers")}>
              Show Users
            </Menu.Item>
            <Menu.Item key="10" onClick={() => handleClick("/addUser")}>
              Add User
            </Menu.Item>
            <Menu.Item key="11" onClick={() => handleClick("/pendingUsers")}>
              Pending Users
            </Menu.Item>
            {/* Add more admin options here if needed */}
          </Menu.SubMenu>
        )}

        {user && user.userRole === "Tourist" && (
          <Menu.SubMenu key="sub5" title="Flights">
            <Menu.Item key="20" onClick={() => handleClick("/flight/bookFlight")}>
              Book Flight
            </Menu.Item>
            {/* <Menu.Item key="21" onClick={() => handleClick("/addUser")}>
              Add User
            </Menu.Item>
            <Menu.Item key="22" onClick={() => handleClick("/pendingUsers")}>
              Pending Users
            </Menu.Item> */}
          </Menu.SubMenu>
          )}
      </Menu>
    </Drawer>
  );
};

export default Sidebar;

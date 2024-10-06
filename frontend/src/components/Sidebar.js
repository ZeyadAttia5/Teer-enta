// DrawerMenu.js
import React from "react";
import { Drawer, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { on } from "events";

const Sidebar = ({ visible, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();
  const clickOptionOne = () => {
    onClose();
    navigate("/preference-tags");
  };
  const clickOptionTwo = () => {
    onClose();
    navigate("/tags");
  };
  const clickOptionThree = () => {
    onClose();
    navigate("/historicalPlace");
  };
  const clickOptionFour = () => {
    onClose();
    navigate("/itinerary");
  };
  const clickOptionFive = () => {
    onClose();
    navigate("/touristItinerary");
  };
  const clickOptionSix = () => {
    onClose();
    navigate("/activity-categories");
  };
  const clickOptionSeven = () => {
    onClose();
    navigate("/allUsers");
  };
  const clickOptionEight = () => {
    onClose();
    navigate("/products");
  };
  return (
    <Drawer
      title="Menu"
      placement="left"
      closable={true}
      onClose={onClose}
      visible={visible}
    >
      <div className="flex flex-col">
        <Button className="mb-2" type="text" onClick={clickOptionOne}>
          Preference Tags
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionTwo}>
          Historical Tags
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionThree}>
          Historical Places
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionFour}>
          Itinerary
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionFive}>
          Tourist Itinerary
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionSix}>
          Activity Category
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionEight}>
          Products
        </Button>
        {user && user.userRole === "Admin" && (
          <Button className="mb-2" type="text" onClick={clickOptionSeven}>
            Users
          </Button>
        )}
      </div>
    </Drawer>
  );
};

export default Sidebar;

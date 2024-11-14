import React from "react";
import { Button, Drawer } from "antd";
import Sidebar from "./Sidebar";
import { MenuOutlined } from "@ant-design/icons";
const DrawerBar = ({ showDrawer, drawerVisible, onClose }) => {
  const navbarColor = window.location.pathname === "/" ? "first" : "fourth";
  return (
    <div className="absolute top-8 left-4 z-20 ">

      {/* Floating Button */}
      <Button
        type="primary"
        icon={<MenuOutlined className={`text-${navbarColor === "first" ? "fourth" : "first"}`}/>}
        onClick={showDrawer}
        className={`bg-${navbarColor}`}
      ></Button>

      <Sidebar visible={drawerVisible} onClose={onClose} />
    </div>
  );
};

export default DrawerBar;

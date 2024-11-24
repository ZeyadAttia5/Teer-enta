import React from "react";
import { Button, Drawer } from "antd";
import Sidebar from "./Sidebar";
import { MenuOutlined } from "@ant-design/icons";
const DrawerBar = ({ showDrawer, drawerVisible, onClose, navbarColor }) => {

  
  return (
    <div className="absolute top-8 left-4 z-20 ">
      {/* Floating Button */}
      <Button
        type="danger"
        icon={
          <MenuOutlined
            className={`text-${navbarColor === "first" ? "fourth" : "first"}`}
          />
        }
        onClick={showDrawer}
        className={`bg-${navbarColor} hover:bg-third`}
      ></Button>

      <Sidebar visible={drawerVisible} onClose={onClose} />
    </div>
  );
};

export default DrawerBar;

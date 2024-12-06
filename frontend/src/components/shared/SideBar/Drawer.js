import React from "react";
import { Button, Drawer } from "antd";
import Sidebar from "./Sidebar";
import { MenuOutlined } from "@ant-design/icons";
const DrawerBar = ({ showDrawer, drawerVisible, onClose, visibleFlag }) => {

  
  return (
    <div className={`fixed ${visibleFlag ? "top-[67px]" : "top-8"} left-4 z-50 `}>
      {/* Floating Button */}
      <Button
        type="danger"
        icon={
          <MenuOutlined
            className={`text-black`}
          />
        }
        onClick={showDrawer}
        className={` hover:bg-gray-100 rounded-full`}
      ></Button>

      <Sidebar visible={drawerVisible} onClose={onClose} />
    </div>
  );
};

export default DrawerBar;
